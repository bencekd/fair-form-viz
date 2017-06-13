shinyServer(function(input, output, session) {  
  ss <- gs_url(googleform_data_url, lookup = FALSE, visibility = "public")
  ss_dat <- gs_read(ss)
  names(ss_dat) <- c("timestamp", "gender", "citytype", "county", "age", "field", "hobbies01", "hobbies02", "hobbies03", "freetime", "bored")  
  ### init rowcounter for trigger plots ###
  row <- reactiveValues(count = 0)
  
  ### init loop function ###
  refresher <- reactiveTimer(30000,session)

  ### get latest data ###
  observe({
    refresher()
    
    ss <- gs_url(googleform_data_url, lookup = FALSE, visibility = "public")
    ss_dat <<- gs_read(ss)
    names(ss_dat) <<- c("timestamp", "gender", "citytype", "county", "age", "field", "hobbies01", "hobbies02", "hobbies03", "freetime", "bored")

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
      lastIndex <- nrow(loc_dat)
      
      # a switch a front-enden "Mindenki"
      # szóval ha FALSE, akkor adja vissza az eredeti állományt (első n sor) + az utolsó sort
      # viszont ha TRUE, akkor kérünk mindent 

      if (input$divider == FALSE) {
        loc_dat <- loc_dat[c(1:20,lastIndex),]
      }
      lastIndex <- nrow(loc_dat)
      
      lastReply <- loc_dat[lastIndex,2:10]
      lastReply$hobbies <- loc_dat[lastIndex,7:9]
      
      agegender <- mutate(loc_dat, gender=replace(gender, gender=="Férfi", "male")) %>%
        mutate(gender=replace(gender, gender=="Nő", "female")) %>%
        group_by(age, gender) %>%    
        summarise(n = n()) %>% 
        spread(gender, n)

        age <- group_by(loc_dat, age) %>%
          summarise(count = n())
      
      citytype <- group_by(loc_dat, citytype) %>%
        summarise(count = n())
      
      county <- group_by(loc_dat, county) %>%
        summarise(count = n()) %>%
        mutate(freq = count / sum(count))
      
      field <- group_by(loc_dat, field) %>%
        select(name = field) %>%
        summarise(count = n())
      
      hobbies01 <- group_by(loc_dat, hobbies01) %>%
        summarise(count = n()) %>%
        mutate(rate = count / sum(count)) %>%
        select(hobby = hobbies01, rate) %>%
        filter(hobby == 'Sorozatok')
      
      hobbies02 <- group_by(loc_dat, hobbies02) %>%
        summarise(count = n()) %>%
        mutate(rate = count / sum(count)) %>%
        select(hobby = hobbies02, rate) %>%
        filter(hobby == 'Star Wars')
      
      hobbies03 <- group_by(loc_dat, hobbies03) %>%
        summarise(count = n()) %>%
        mutate(rate = count / sum(count)) %>%
        select(hobby = hobbies03, rate) %>%
        filter(hobby == "Gyűrűk ura")
    
    hobby <- rbind(hobbies01,hobbies02,hobbies03)
    
    schema <- c("Utazom","Sportolok","Olvasok","Képzem magam","Játszom","Családdal vagyok","Mi az a szabadidő?!")
    
    freetime <- matrix(
      c(0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,
        0,0,0,0,0,0,0), 
      nrow = 7, ncol = 7)
    colnames(freetime) <- schema

    splitTime <- strsplit(loc_dat$freetime, ", ")
        
    for(i in seq_along(splitTime)) {
      fill <- which(schema %in% splitTime[[i]])
      
      if (length(fill) == 1) {
        freetime[fill,fill] <- freetime[fill,fill] + 1
      } else {
        for(value in seq_along(fill)) {
          for(netvalue in seq_along(fill)) {
            if (netvalue > value) {
              freetime[fill[value],fill[netvalue]] <- freetime[fill[value],fill[netvalue]] + 1
            }
          }
        }
      }
    }

    # calculate score

    # county
    comp01 <- (county$count[county$county == lastReply$county] / max(county$count)) * 25;
    comp02 <- (field$count[field$name == lastReply$field] / max(field$count)) * 25;
    comp03 <- (age$count[age$age == lastReply$age] / max(age$count)) * 25;
    comp04 <- sum((25 / dim(hobby)[1]) * unlist(sapply(1:dim(hobby)[1], function(i) if(lastReply$hobbies[i] == hobby[i, 1]){ hobby[i,2] } else { 1-hobby[i,2]})))

    hiflyscore = comp01 + comp02 + comp03 + comp04
    
    session$sendCustomMessage(type="json_lastreply",toJSON(lastReply))
    session$sendCustomMessage(type="json_agegender",toJSON(agegender))
    session$sendCustomMessage(type="json_citytype",toJSON(citytype))
    session$sendCustomMessage(type="json_county",toJSON(county))
    session$sendCustomMessage(type="json_field",toJSON(field))
    session$sendCustomMessage(type="json_hobby",toJSON(hobby))
    session$sendCustomMessage(type="json_freetime",toJSON(toJSON(data.frame(freetime))))

    session$sendCustomMessage(type="updatedShiny",hiflyscore)
  })
})
