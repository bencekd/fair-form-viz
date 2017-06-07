shinyUI(
	fluidPage(

	  ### INIT D3.JS ###
	  # tags$head(tags$link(rel = "stylesheet", type = "text/css", href = "style.css")),
	  # tags$script(src="https://d3js.org/d3.v3.min.js"),
	  # tags$script(src="d3script.js"),
	  
	  
	  fluidRow(
	    column(6,tags$div(id="shiny_map")),
	    column(6,tags$div(id="shiny_agegender"))
	  ),
	  fluidRow(
	    column(6,tags$div(id="shiny_place")),
	    column(6,tags$div(id="shiny_hobby"))
	  ),
	  fluidRow(
	    column(6,tags$div(id="shiny_field")),
	    column(6,tags$div(id="shiny_freetime"))
	  ),
	  fluidRow(
	    column(12,tags$div(id="shiny_hobby"))
	  )
	)
)