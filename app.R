setwd("C:/Work/Hifly/recruiting/integration")

library(shiny)
library(dplyr)
library(googlesheets)
library(jsonlite)
# library(rjson)
library(data.tree)

## ======================
googleform_data_url <- "https://docs.google.com/spreadsheets/d/1-MenO5iBQU-p-rs21KSJhdpctOgAJAa25QsQbzAejto/pubhtml?gid=1809563106&single=true"
## ======================

#-----------------------APP START-----------------------
runApp(".")