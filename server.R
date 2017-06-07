shinyServer(function(input, output, session) {  
  ss <- gs_url(googleform_data_url, lookup = FALSE, visibility = "public")
  ss_dat <- gs_read(ss)
  
  ### init rowcounter for trigger plots ###
  row <- reactiveValues(count = 0)
  
  ### init loop function ###
  refresher <- reactiveTimer(1000,session)

  ### get latest data ###
  observe({
    refresher()
    
    ss <- gs_url(googleform_data_url, lookup = FALSE, visibility = "public")
    
    ss_dat <<- gs_read(ss) %>%
      select(timestamp = `Id<U+0151>b<U+00E9>lyeg`,
         gender = `Mi a nemed?`,
         citytype = `Milyen telep<U+00FC>l<U+00E9>sen sz<U+00FC>lett<U+00E9>l?`,
         county = `Melyik megy<U+00E9>ben sz<U+00FC>lett<U+00E9>l?`,
         age = `H<U+00E1>ny <U+00E9>ves vagy?`,
         field = `Milyen ter<U+00FC>letr<U+0151>l <U+00E9>rkezel?`,
         seriesmovie = `Sorozatok vagy Filmek?`,
         starwarstrek = `Star Wars vagy Star Trek?`,
         lordofthrones = `Gy<U+0171>r<U+0171>k ura vagy Tr<U+00F3>nok harca?`,
         freetime = `Szabadid<U+0151>mben...`,
         bored = `Mennyire unom m<U+00E1>r ezt a k<U+00E9>rd<U+0151><U+00ED>vet?`)
      )
    
    if (nrow(ss_dat) > row$count) { row$count <- nrow(ss_dat) }
  })
  
  
  ### GENDER PIE ###
  observeEvent(row$count, {
    
    agegender <- group_by(ss_dat, gender, age) %>%
      summarise(count = n())
    
    place <- group_by(ss_dat, place) %>%
      summarise(count = n())
    
    county <- group_by(ss_dat, county) %>%
      summarise(count = n())
    
    field <- group_by(ss_dat, field) %>%
      summarise(count = n())
    
    seriesmovie <- group_by(ss_dat, seriesmovie) %>%
      summarise(count = n()) %>%
      mutate(rate = count / sum(count)) %>%
      select(hobby = seriesmovie, rate) %>%
      filter(hobby == 'Sorozatok')
    
    starwarstrek <- group_by(ss_dat, starwarstrek) %>%
      summarise(count = n()) %>%
      mutate(rate = count / sum(count)) %>%
      select(hobby = starwarstrek, rate) %>%
      filter(hobby == 'Star Wars')
    
    lordofthrones <- group_by(ss_dat, lordofthrones) %>%
      summarise(count = n()) %>%
      mutate(rate = count / sum(count)) %>%
      select(hobby = lordofthrones, rate) %>%
      filter(hobby == 'Gyűrűk ura')
    
    hobby <- rbind(seriesmovie,starwarstrek,lordofthrones)
    
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

    splitTime <- strsplit(ss_dat$freetime, ", ")
        
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
    
    session$sendCustomMessage(type="json_agegender",toJSON(county))
    session$sendCustomMessage(type="json_place",toJSON(place))
    session$sendCustomMessage(type="json_county",toJSON(county))
    session$sendCustomMessage(type="json_field",toJSON(field))
    session$sendCustomMessage(type="json_hobby",toJSON(hobby))
    session$sendCustomMessage(type="json_freetime",toJSON(toJSON(data.frame(freetime))))
  })
})