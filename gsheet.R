library(googlesheets)
googleform_data_url <- "https://docs.google.com/spreadsheets/d/1-MenO5iBQU-p-rs21KSJhdpctOgAJAa25QsQbzAejto/pubhtml?gid=409635410&single=true"

ss <- gs_url(googleform_data_url, lookup = FALSE, visibility = "public")
ss_dat <- gs_read(ss) %>%
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
ss_dat
part <- group_by(ss_dat, gender)
sum <- summarise(part, participants = n())
