args <- commandArgs(trailingOnly = TRUE)

.libPaths( c( .libPaths(), args[2]) )

setwd(args[2])


install.packages("frbs", lib = args[2], repos = "http://cran.rstudio.com/",quiet = T)

args <- commandArgs(trailingOnly = TRUE)


# setwd('E:/Projects/kpi/rzd/rzd-r')
getwd()

data1 <- read.table("Delta_For.csv", header=TRUE, sep=",")

# delta_fact
for(i in 1:length(data1$delta_fact)){
  data1$delta_fact[i]= if (data1$cstation[i]==46720) {data1$time_in_hours[i]} else {data1$time_in_hours[i]-data1$time_in_hours[i-1]} 
}

# delta_norm
for(i in 1:length(data1$delta_norm)){
  data1$delta_norm[i]= if (data1$cstation[i]==46720) {data1$norm_in_hours[i]} else {data1$norm_in_hours[i]-data1$norm_in_hours[i-1]} 
}

# delta - çàãàëüíå â³äõèëåííÿ â³ä ãğàô³êà 
# delta=ôàêòè÷íèé - íîğìàòèâíèé ÷àñ â³äïğàâëåííÿ ç³ ñòàíö³¿
# delta
delta=vector('numeric',length(data1$delta_norm))
for(i in 1:length(data1$delta_norm)){
  delta[i]= data1$time_in_hours[i]-data1$norm_in_hours[i]
}

data2=data.frame(data1,delta)



# çàïèñè ç ê³ëüê. âàãîí³â >=40 ³ç data2 
data_ge_40=data2[which(data2$countcars>=40),]
# length(data_ge_40$countcars)
#write.csv(data_ge_40, file="Delta_01_GE_40.csv",row.names=T)

                                                               # äàë³ - ôîêóñ:
                                                               #data_le_115=data_ge_40

fctr_ge_40<- factor(data_ge_40$cstation, order=TRUE,
             levels=c("46720", "46730", "46760", "46790", "46800", "41411", "41360", "41420", "41424", "41351", "41340", "41330", "41320", "41310", "41300", "41290", "41280", "41270", "40160", "40150", "40143", "40590", "40110", "40090", "40002", "40000", "40030"),
             labels=c("ÊĞÈÂÈÉ Ğ²Ã", "ÊĞÈÂÈÉ Ğ²Ã-ÇÀÕ²ÄÍÈÉ", "ÌÓÑ²¯ÂÊÀ", "ÃÅÉÊ²ÂÊÀ", "ÂÈÑÓÍÜ", "ÒÈÌÊÎÂÅ", "×ÅĞÂÎÍÅ ÎÇÅĞÎ (ĞÇÄ)", "ÁÎÁĞÈÍÅÖÜ", "ÊĞÎÏÈÂÍÈÖÜÊÀ", "ÎË²ÉÍÈÊÎÂÅ", "ÊÀÂÓÍÈ", "ŞÆÍÎÓÊĞÀ¯ÍÑÜÊÀ", "ÒĞÈÊĞÀÒÍÅ", "ÎËÅÊÑÀÍÄĞ²ÂÊÀ", "ÂÎÇÍÅÑÅÍÑÜÊ", "ÌÀĞÒÈÍ²ÂÑÜÊÀ", "ÂÅÑÅËÈÍÎÂÅ", "ÊÎËÎÑ²ÂÊÀ", "ÁÅĞÅÇ²ÂÊÀ", "ĞÀÓÕ²ÂÊÀ", "ÑÅĞÁÊÀ", "ÁÓßËÈÊ", "×ÎĞÍÎÌÎĞÑÜÊÀ", "ÊÓËÈÍÄÎĞÎÂÅ", "ÎÄÅÑÀ-ÑÕ²ÄÍÀ", "ÎÄÅÑÀ-ÑÎĞÒÓÂÀËÜÍÀ", "ÎÄÅÑÀ-ÏÎĞÒ"))

vagon_40000<-data_ge_40[data_ge_40$cstation==40000,]$vagon
vagon_40030<-data_ge_40[data_ge_40$cstation==40030,]$vagon

unique_vagon<-unique(data_ge_40$vagon)
pointStation<-c(46720,41411,41424,41270,40000,40030)
pointStationNames<-c("ÊĞÈÂÈÉ Ğ²Ã","ÒÈÌÊÎÂÅ","ÊĞÎÏÈÂÍÈÖÜÊÀ","ÊÎËÎÑ²ÂÊÀ","ÎÄÅÑÀ-ÑÎĞÒÓÂÀËÜÍÀ","ÎÄÅÑÀ-ÏÎĞÒ")


# òóò 406 âàãîí³â/ïîòÿã³â, çàïèñàí³ íà êîæí³é ñòàíö³¿ ç pointStation
data_ge_40_406<-data_ge_40[data_ge_40$vagon %in% vagon_40000 & data_ge_40$cstation %in% pointStation,]

# ïîâåğòàº ôğåéì ç ïîëÿìè vagon + pointStationNames + delta
forClassif<-function(){
   dt<-data_ge_40_406[c(2,6,15)] # ò³ëüêè ïîëÿ vagon, cstation òà delta
   Kryvyi_Rih<-dt[dt$cstation==46720,]$delta
   Tymkove<-dt[dt$cstation==41411,]$delta
   Kropyvnytska<-dt[dt$cstation==41424,]$delta
   Kolosivka<-dt[dt$cstation==41270,]$delta
   Odesa_sortuvalna<-dt[dt$cstation==40000,]$delta
   Odesa_port<-dt[dt$cstation==40030,]$delta
   return(data.frame(Kryvyi_Rih,Tymkove,Kropyvnytska,Kolosivka,Odesa_sortuvalna,Odesa_port))
}



# ğîçğàõóíîê ïğîöåíòèëÿ part ç â³äğ³çêà [0;1]
# çà ïîëåì delta
# äëÿ ñòàíö³¿ cst 
# ïîâåğòàº ò³ëüêè çíà÷åííÿ, áåç ³ìåí³ (ïîäâ³éí³ äóæêè res[[1]])
# > prcntl(data_ge_40,46730,0.98)
# [1] 1.88
prcntl<-function(data,cst,part){
   res<-quantile(data[which(data_ge_40$cstation==cst),]$delta,c(part))
   return(res[[1]])
}


class_prcnt<-c(0.05, 0.15, 0.25, 0.5, 0.75, 0.9 )
class_name <-c("ÏĞÈÉÍßÒÍÅ","ÏÎÌ²ÒÍÅ","ßÂÍÅ","ÇÍÀ×ÍÅ","ÑÅĞÉÎÇÍÅ","ÊĞÈÒÈ×ÍÅ","ÍÀÄÊĞÈÒÈ×ÍÅ")
#class_prcnt<-c( 0.25, 0.5, 0.75 )
#class_name <-c("ÏÎÌ²ÒÍÅ","ßÂÍÅ","ÇÍÀ×ÍÅ","ÊĞÈÒÈ×ÍÅ")

classBoard<-function(cst,class_prcnt){
   class_board<-vector('numeric',length(class_prcnt))
   for (i in 1:length(class_prcnt)) 
        class_board[i]<-prcntl(data_ge_40,cst,class_prcnt[i])
   return(class_board)
}



# äëÿ ïåğåêîäóâàííÿ ÂÕ²ÄÍÎ¯ àáî ÂÈÕ²ÄÍÎ¯ çì³ííî¿ ó êëàñ òàêñîíîì³¿
# íà âõîä³ - òî÷êè ğîçïîä³ëó ó ÷àñòêàõ îäèíèö³ class_prcnt
# òà íàçâè êëàñ³â âèõ³äíî¿ çì³ííî¿ class_name
# ôóíêö³ÿ ïîâåğòàº ñòğóêòóğó äàíèõ äëÿ íàâ÷àííÿ ìîäåë³ çà Ìàìäàí³
getScoreAll<-function(data_vec,cst,class_prcnt,class_name){
   len_data<-length(data_vec)
   # âèçíà÷èòè ãğàíè÷í³ ğ³âí³ â³äõèëåííÿ delta â³äïîâ³äíî ïğîöåíòèëÿì
   class_board<-vector('numeric',length(class_prcnt))
   for (i in 1:length(class_prcnt)) 
        class_board[i]<-prcntl(data_ge_40,cst,class_prcnt[i])
   res<-vector('character',len_data)
   for (i in 1:len_data) res[i]<-fscore(data_vec[i],class_board,class_name)
   return(res)
}
# ïîâåğòàº ñëîâåñíó îö³íêó çíà÷åííÿ val
#äëÿ ïğèéíÿòèõ class_board òà class_name
fscore<-function(val,class_board,class_name){
  if (val<=class_board[1]) return(class_name[1])
  if (val>class_board[length(class_board)]) return(class_name[length(class_board)+1])
  
  for (i in 1:(length(class_board)-1)) {
     #print(c(val,i,class_board[i],class_board[i+1]))
     if (val>class_board[i] & val<=class_board[i+1]) return(class_name[i+1])
  }
}

# äàí³ äëÿ êëàñèô³êàö³¿
fc<-forClassif()

# âåğáàëüí³ îö³íêè ïî ñò. Îäåñà-ïîğò
out_vec<-getScoreAll(fc[,6],40030,class_prcnt,class_name)

# ïîâåğòàº ôğåéì ç n+1 ğÿäêà
# ç äàíèìè äëÿ îáğîáêè
# n - âõ³äí³ çì³íí³
# 1 - âèõ³äíà ç³ ñëîâåñíèìè îö³íêàìè
# out_vec - âæå âèçíà÷åíèé
# variables=c(...) 
# ç ïåğåë³êó c(fc$Tymkove,fc$Kropyvnytska,fc$Kolosivka,fc$Odesa_sortuvalna)
# length(variables==n)
train_40_6<-function(fc,out_vec){
              Tymkove<-fc[,]$Tymkove
              Kropyvnytska<-fc[,]$Kropyvnytska
              Kolosivka<-fc[,]$Kolosivka
              Odesa_sortuvalna<-fc[,]$Odesa_sortuvalna
              Odesa_port<-out_vec
  res<-data.frame(Tymkove,
             Kropyvnytska,
             Kolosivka,
             Odesa_sortuvalna,
             Odesa_port
             )
  return(res)
}

# ÏÎÂÍ²ÑÒŞ ÃÎÒÎÂ² ÄÀÍ²
train406<-train_40_6(fc,out_vec)
#str(train406)
       #Ğîçïîä³ë çà êëàñàìè Odesa_port  
       fctrOdPort<-factor(train406$Odesa_port,order=TRUE,labels=class_name) #âñ³
       vec_lbl<-1:5
       fctrOdPortPart<-factor(train406$Odesa_port[train406$Odesa_port %in% class_name[vec_lbl]],order=TRUE,labels=class_name[vec_lbl])
       #fctrOdPortPart<-fctrOdPort[fctrOdPort %in% c("ÏĞÈÉÍßÒÍÅ","ÏÎÌ²ÒÍÅ","ßÂÍÅ","ÇÍÀ×ÍÅ","ÑÅĞÉÎÇÍÅ")]  #train406$Odesa_port[train406$Odesa_port %in% c("ÏĞÈÉÍßÒÍÅ","ÏÎÌ²ÒÍÅ","ßÂÍÅ","ÇÍÀ×ÍÅ","ÑÅĞÉÎÇÍÅ")] #class_name[vec_lbl]] #class_name <-c("ÏĞÈÉÍßÒÍÅ","ÏÎÌ²ÒÍÅ","ßÂÍÅ","ÇÍÀ×ÍÅ","ÑÅĞÉÎÇÍÅ","ÊĞÈÒÈ×ÍÅ","ÍÀÄÊĞÈÒÈ×ÍÅ")[c(1,3)]
       plot(fctrOdPortPart,sub="ÎÄÅÑÀ-ÏÎĞÒ",main="Ğîçïîä³ë çà êëàñàìè")

############################
library(frbs)

num_inp<-4
num_col_out<-5
num_to_learn<-306

set.seed(2)
train406Shuffled <- train406[sample(nrow(train406)),]
train406Shuffled[,num_col_out] <- unclass(train406Shuffled[,num_col_out])

tra.train406 <- train406Shuffled[1:num_to_learn,]
tst.train406 <- train406Shuffled[(num_to_learn+1):nrow(train406Shuffled),1:num_inp]
real.train406 <- matrix(train406Shuffled[(num_to_learn+1):nrow(train406Shuffled),num_col_out], ncol = 1)
real.train406.all <- matrix(train406Shuffled[(1):nrow(train406Shuffled),num_col_out], ncol = 1)

range.data.input <- 
    matrix(c(min(fc[,]$Tymkove), max(fc[,]$Tymkove), 
             min(fc[,]$Kropyvnytska), max(fc[,]$Kropyvnytska), 
             min(fc[,]$Kolosivka), max(fc[,]$Kolosivka),
             min(fc[,]$Odesa_sortuvalna), max(fc[,]$Odesa_sortuvalna)), 
    nrow=2)
 
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
        class_boarD[i]<-prcntl(data_ge_40,40030,class_prcnt[i])


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

plotMF(object)

#plot(c(0,0,2,8,100),
#     c(0,1,1,0,0),type="l",axis=FALSE)
#lines(c(0,2,7,12,18,100),
#      c(0,0,1,1,0,0),type="l")

#lines(c(0,10,18,100),
#      c(0,0,1,1,0,0),type="l")

opar <- par(no.readonly=TRUE)
par(mfrow=c(3,1))
hist(real.train406,freq = FALSE, xlab="",main="Training values")
hist(real.train406,nclass = 8,freq = FALSE,xlab="Score",main="Testing values")
hist(res.test,nclass = 8,freq = FALSE,xlab="Score",main="Predicted values")


#scatterplot3d(allData[,1],allData[,2],allData[,3],color=c(rep("red",34),rep("blue",9)))

print(warnings())

