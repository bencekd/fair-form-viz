shinyServer(function(input, output, session) {  
  ss <- gs_url(googleform_data_url, lookup = FALSE, visibility = "public")
  ss_dat <- gs_read(ss)
  names(ss_dat) <- c("timestamp", "gender", "county", "age", "field", "vs1", "vs2", "vs3", "vs4", "vs5", "vs6", "email")  
  ### init rowcounter for trigger plots ###
  row <- reactiveValues(count = 0)
  
  ### init loop function ###
  refresher <- reactiveTimer(30000,session)

  ### get latest data ###
  observe({
    refresher()
    
    ss <- gs_url(googleform_data_url, lookup = FALSE, visibility = "public")
    ss_dat <<- gs_read(ss)
    names(ss_dat) <<- c("timestamp", "gender", "county", "age", "field", "vs1", "vs2", "vs3", "vs4", "vs5", "vs6", "email")  

      # select(timestamp = names(.)[1],
      #    gender = `Mi a nemed?`,
      #    citytype = `Milyen telep<U+00FC>l<U+00E9>sen sz<U+00FC>lett<U+00E9>l?`,
      #    county = `Melyik megy<U+00E9>ben sz<U+00FC>lett<U+00E9>l?`,
      #    age = `H<U+00E1>ny <U+00E9>ves vagy?`,
      #    field = `Milyen ter<U+00FC>letr<U+0151>l <U+00E9>rkezel?`,
      #    seriesmovie = `Sorozatok vagy Filmek?`,
      #    starwarstrek = `Star Wars vagy Star Trek?`,
      #    lordofthrones = `Gy<U+0171>r<U+0171>k ura vagy Tr<U+00F3>nok harca?`,
      #    freetime = `Szabadid<U+0151>mben...`,
      #    bored = `Mennyire unom m<U+00E1>r ezt a k<U+00E9>rd<U+0151><U+00ED>vet?`
      # )
    
    if (nrow(ss_dat) > row$count) { row$count <- nrow(ss_dat) }
  })
  
  
  ### OBSERVE EVENTS ###
  observeEvent({row$count
    input$divider}, {
    
      loc_dat <- ss_dat
      names(loc_dat) <- c("timestamp", "gender", "county", "age", "field", "vs1", "vs2", "vs3", "vs4", "vs5", "vs6", "email") 
      lastIndex <- nrow(loc_dat)
      
      # a switch a front-enden "Mindenki"
      # szóval ha FALSE, akkor adja vissza az eredeti állományt (első n sor) + az utolsó sort
      # viszont ha TRUE, akkor kérünk mindent 

      if (input$divider == FALSE) {
        loc_dat <- loc_dat[c(1:10,lastIndex),]
      }
      lastIndex <- nrow(loc_dat)
      
      lastReply <- loc_dat[lastIndex,]
      lastReply$vs <- loc_dat[lastIndex,6:11]
      
      agegender <- mutate(loc_dat, gender=replace(gender, gender=="Férfi", "male")) %>%
        mutate(gender=replace(gender, gender=="Nő", "female")) %>%
        group_by(age, gender) %>%    
        summarise(n = n()) %>% 
        spread(gender, n)

      age <- group_by(loc_dat, age) %>%
        summarise(count = n())
      
      county <- group_by(loc_dat, county) %>%
        summarise(count = n()) %>%
        mutate(freq = count / sum(count))
      
      field <- group_by(loc_dat, field) %>%
        select(name = field) %>%
        summarise(count = n())

      vsAll <- genVS(loc_dat, 1:6)

    # calculate score

    # county
    comp01 <- (county$count[county$county == lastReply$county] / max(county$count)) * 25;
    comp02 <- (field$count[field$name == lastReply$field] / max(field$count)) * 25;
    comp03 <- (age$count[age$age == lastReply$age] / max(age$count)) * 25;
    comp04 <- sum((25 / dim(vsAll)[1]) * unlist(sapply(1:dim(vsAll)[1], function(i) if(lastReply$vs[i] == vsAll[i, 1]){ vsAll[i,3] } else { 1-vsAll[i,3]})))

    hiflyscore = comp01 + comp02 + comp03 + comp04  

    session$sendCustomMessage(type="json_lastreply",toJSON(lastReply))
    session$sendCustomMessage(type="json_agegender",toJSON(agegender))
    session$sendCustomMessage(type="json_county",toJSON(county))
    session$sendCustomMessage(type="json_field",toJSON(field))
    session$sendCustomMessage(type="json_vs",toJSON(vsAll))

    session$sendCustomMessage(type="updatedShiny",hiflyscore)
  })
})


genVS <- function(data, sequence){
  for(i in sequence){
    counter <- i + 5
    grpby <- as.symbol(names(data)[counter])
    vs <- group_by_(data, .dots = grpby) %>%
    summarise(count = n()) %>%
    mutate(rate = count / sum(count)) %>%
    select(name = 1, 2:3) %>%
    filter(.[[1]] == .[[1,1]])
    if(exists("vsAll")){
      vsAll <- rbind(vsAll, vs)
    } else {
      vsAll <- vs
    }
  }
  return(vsAll)
}