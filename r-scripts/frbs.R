
# getwd()
# input_data <- read.table("Delta_For.csv", header=TRUE, sep=",")

args <- commandArgs(trailingOnly = TRUE)

setwd(args[2])

input_data <- read.table("in.csv", header=TRUE, sep=",")


station_numbers <- c(args[1]) # c(46720,41411,41424,41270,40000,40030);
station_names <- c("КРИВИЙ РІГ","ТИМКОВЕ","КРОПИВНИЦЬКА","КОЛОСІВКА","ОДЕСА-СОРТУВАЛЬНА","ОДЕСА-ПОРТ");

stations_len = length(station_numbers);

begin_station_num <- station_numbers[1];
end_station_num <- tail(station_numbers, n=1);



# delta_fact
for(i in 1:length(input_data$delta_fact)){
  input_data$delta_fact[i]= if (input_data$cstation[i]==46720) {input_data$time_in_hours[i]} else {input_data$time_in_hours[i]-input_data$time_in_hours[i-1]} 
}

# delta_norm
for(i in 1:length(input_data$delta_norm)){
  input_data$delta_norm[i]= if (input_data$cstation[i]==46720) {input_data$norm_in_hours[i]} else {input_data$norm_in_hours[i]-input_data$norm_in_hours[i-1]} 
}

# delta - загальне відхилення від графіка 
# delta=фактичний - нормативний час відправлення зі станції
# delta
delta=vector('numeric',length(input_data$delta_norm))
for(i in 1:length(input_data$delta_norm)){
  delta[i]= input_data$time_in_hours[i]-input_data$norm_in_hours[i]
}

data_with_delta=data.frame(input_data,delta)



# записи з кільк. вагонів >=40 із data_with_delta 
data_over_40_cars = data_with_delta[which(data_with_delta$countcars>=40),]
# length(data_over_40_cars$countcars)
#write.csv(data_over_40_cars, file="Delta_01_GE_40.csv",row.names=T)

# далі - фокус:
#data_le_115=data_over_40_cars

# одесса-сорт
vagons_through_spec_station<-data_over_40_cars[data_over_40_cars$cstation==rev(station_numbers)[2],]$vagon


# вагон - номер поезда
unique_vagon<-unique(data_over_40_cars$vagon)

# тут 406 вагонів/потягів, записані на кожній станції з pointStation
# поезд проходит через одесса-сорт и станция одна из указанных
# почему выбрали одесса-сорт ? последний пункт - одесса-порт же
vagon_through_itinerary<-data_over_40_cars[data_over_40_cars$vagon %in% vagons_through_spec_station & data_over_40_cars$cstation %in% station_numbers,]

# повертає фрейм з полями vagon + pointStationNames + delta
forClassif<-function(){
  dt<-vagon_through_itinerary[c(2,6,15)] # тільки поля vagon, cstation та delta
  output <- data.frame(Head = dt[dt$cstation == station_numbers[1],]$delta);
  for(i in 1:length(station_numbers)) {
    output[,i] <- dt[dt$cstation == station_numbers[i],]$delta
  }
  return (output);
}


# Кванти́ль в математической статистике — значение, которое заданная случайная величина не превышает
# с фиксированной вероятностью. Если вероятность задана в процентах, то квантиль называется процентилем 
# или перцентилем (см. ниже).
#
# Например, фраза «для развитых стран 95-процентиль продолжительности жизни составляет 100 лет» означает, 
# что ожидается, что 95 % людей не доживут до 100 лет.
#
# розрахунок процентиля part з відрізка [0;1]
# за полем delta
# для станції cst 
# повертає тільки значення, без імені (подвійні дужки res[[1]])
# prcntl(data_over_40_cars,46730,0.98)
# [1] 1.88
prcntl<-function(data,cst,part){
  res<-quantile(data[which(data$cstation==cst),]$delta,c(part))
  return(res[[1]])
}

class_prcnt<-c(0.05, 0.15, 0.25, 0.5, 0.75, 0.9 )
# почему 7 названий
class_name <-c("ПРИЙНЯТНЕ","ПОМІТНЕ","ЯВНЕ","ЗНАЧНЕ","СЕРЙОЗНЕ","КРИТИЧНЕ","НАДКРИТИЧНЕ")
#class_prcnt<-c( 0.25, 0.5, 0.75 )
#class_name <-c("ПОМІТНЕ","ЯВНЕ","ЗНАЧНЕ","КРИТИЧНЕ")

# что зачем?
# 
#classBoard<-function(cst,class_prcnt){
#  class_board<-vector('numeric',length(class_prcnt))
#  for (i in 1:length(class_prcnt)) 
#    class_board[i]<-prcntl(data_over_40_cars,cst,class_prcnt[i])
#  return(class_board)
#}



# для перекодування ВХІДНОЇ або ВИХІДНОЇ змінної у клас таксономії
# на вході - точки розподілу у частках одиниці class_prcnt
# та назви класів вихідної змінної class_name
# функція повертає структуру даних для навчання моделі за Мамдані
getScoreAll<-function(data_vec,cst,class_prcnt,class_name){
  len_data<-length(data_vec)
  # визначити граничні рівні відхилення delta відповідно процентилям
  class_board<-vector('numeric',length(class_prcnt))
  for (i in 1:length(class_prcnt)) 
    class_board[i]<-prcntl(data_over_40_cars,cst,class_prcnt[i])
  res<-vector('character',len_data)
  
  for (i in 1:len_data) res[i]<-fscore(data_vec[i],class_board,class_name)
  return(res)
}


# повертає словесну оцінку значення val
#для прийнятих class_board та class_name
fscore<-function(val,class_board,class_name){
  if (val<=class_board[1]) return(class_name[1])
  if (val>class_board[length(class_board)]) return(class_name[length(class_board)+1])
  
  for (i in 1:(length(class_board)-1)) {
    #print(c(val,i,class_board[i],class_board[i+1]))
    if (val>class_board[i] & val<=class_board[i+1]) return(class_name[i+1])
  }
}
# дані для класифікації
fc<-forClassif()

# вербальні оцінки по ст. Одеса-порт
out_vec<-getScoreAll(fc[,stations_len],end_station_num,class_prcnt,class_name)
# повертає фрейм з n+1 рядка
# з даними для обробки
# n - вхідні змінні
# 1 - вихідна зі словесними оцінками
# out_vec - вже визначений
# variables=c(...) 
# з переліку c(fc$Tymkove,fc$Kropyvnytska,fc$Kolosivka,fc$Odesa_sortuvalna)
# length(variables==n)
data_with_output_class<-function(fc,out_vec){
  # пропускаем 1ю колонку (начало маршрута)
  output = data.frame('1'=fc[2])
  for (i in 3:ncol(fc)) {
    output[i-2] = fc[i]
  }
  

  res<-data.frame(output, out_vec);
  
  return(res)
}

# ПОВНІСТЮ ГОТОВІ ДАНІ
fin_data<-data_with_output_class(fc,out_vec)

############################
library(frbs)

num_inp<-stations_len-1
num_col_out<-stations_len
num_to_learn<-306

set.seed(2)
fin_data_shuffled <- fin_data[sample(nrow(fin_data)),]
fin_data_shuffled[,num_col_out] <- unclass(fin_data_shuffled[,num_col_out])

tra.train406 <- fin_data_shuffled[1:num_to_learn,]
tst.train406 <- fin_data_shuffled[(num_to_learn+1):nrow(fin_data_shuffled),1:num_inp]
real.train406 <- matrix(fin_data_shuffled[(num_to_learn+1):nrow(fin_data_shuffled),num_col_out], ncol = 1)
real.train406.all <- matrix(fin_data_shuffled[(1):nrow(fin_data_shuffled),num_col_out], ncol = 1)

range.data.input <- matrix(ncol = ncol(fc)-2, nrow = 2);
for (i in 2:(ncol(fc)-1)) {
  range.data.input[1:2,i-1] = c(min(fc[i]), max(fc[i]));
}


## Set the method and its parameters
method.type <- "FRBCS.W"                  #"TRAPEZOID"  "GAUSSIAN"
control <- list(
  num.labels = 50, 
  type.mf = "GAUSSIAN", type.tnorm = "MIN", 
  type.snorm = "MAX", type.implication.func = "ZADEH")  

## Generate fuzzy model
object <- frbs.learn(tra.train406, range.data.input, method.type, control)

## Predicting step
res.test <- predict(object, tst.train406)

fileConn<-file("out.txt")
writeLines(res.test, fileConn)
close(fileConn)

## error calculation
#err1 = 100*sum(real.train406!=res.test)/nrow(real.train406)

print("The result: ")
#print(res.test)
#print("FRBCS.W: percentage Error on Train406")
#print(err) 

Diff<-0
Board<-7


class_boarD<-vector('numeric',length(class_prcnt))
for (i in 1:length(class_prcnt)) 
  class_boarD[i]<-prcntl(data_over_40_cars,40030,class_prcnt[i])


cnt<-0
for (i in 1:length(res.test)) {
  if (res.test[i]-real.train406[i]>=-5 & res.test[i]-real.train406[i]<=Diff & res.test[i]<=Board & real.train406[i]<=Board)
    #if (abs(res.test[i]-real.train406[i])<=Diff & res.test[i]<=Board & real.train406[i]<=Board)
    
  { cnt<-cnt+1
  print(c(i,res.test[i],real.train406[i],cnt))}
}
#Diff=
Diff

# res.test and real.train406 both <
Board
# is 
c(length(res.test[res.test<=Board]),length(real.train406[real.train406<=Board]))
# res.test/real.train406=
length(res.test[res.test<=Board])/length(real.train406[real.train406<=Board])
# cnt/length(real.train406<=Board) is
cnt/length(real.train406[real.train406<=Board])

# plotMF(object)

#plot(c(0,0,2,8,100),
#     c(0,1,1,0,0),type="l",axis=FALSE)
#lines(c(0,2,7,12,18,100),
#      c(0,0,1,1,0,0),type="l")

#lines(c(0,10,18,100),
#      c(0,0,1,1,0,0),type="l")

opar <- par(no.readonly=TRUE)
par(mfrow=c(3,1))
# hist(real.train406,freq = FALSE, xlab="",main="Training values")
# hist(real.train406,nclass = 8,freq = FALSE,xlab="Score",main="Testing values")
# hist(res.test,nclass = 8,freq = FALSE,xlab="Score",main="Predicted values")


#scatterplot3d(allData[,1],allData[,2],allData[,3],color=c(rep("red",34),rep("blue",9)))

