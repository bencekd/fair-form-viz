shinyUI(
	fluidPage( id= "main-container",
	  tags$head(
	      tags$link(rel = "stylesheet", type = "text/css", href = "styles/main-styles.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "styles/bootstrap.min.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "https://fonts.googleapis.com/css?family=Roboto+Condensed"),

	      tags$script(src = "http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"),
	      tags$script(src = "http://maps.stamen.com/js/tile.stamen.js?v1.3.0"),
	      tags$script(src="https://d3js.org/d3.v4.min.js"),
	      tags$script(src= "js/hungaryGEO.js")
	      # tags$script(src= "d3_demochart.js")
	    ),
	  titlePanel(
	  	tags$img(src= "img/logo-white.png")
	  	),
	  fluidRow(
	    column(6,
	    	wellPanel(
	    		tags$div(id="shiny_map"), class="container-box")
	    	),
	    column(6,
	    	wellPanel(
	    		tags$div(id="shiny_agegender"), class="container-box")
	    	)
	  ),
	  fluidRow(
	    column(6,
	    	wellPanel(
	    		tags$div(id="shiny_field"), class="container-box")
	    	),
	    column(6,
	    	wellPanel(
	    		tags$div(), class="container-box")
	    	)
	  ),
	  fluidRow(
	    column(6,tags$div(), class="container-box"),
	    column(6,tags$div(id="shiny_freetime"), class="container-box")
	  ),
	  fluidRow(
	    column(12,tags$div(id="shiny_hobby"), class="container-box")
	  ),
	  tags$script(src= "js/visualizations.js")
	)
)