source("./Rsource/SwitchButton.R")

shinyUI(
	fluidPage( id="main-container",
	  tags$head(
	      tags$link(rel = "stylesheet", type = "text/css", href = "styles/main-styles.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "styles/bootstrap.min.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "https://fonts.googleapis.com/css?family=Roboto+Condensed"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "styles/button.css"),

	      tags$script(src = "http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"),
	      tags$script(src = "http://maps.stamen.com/js/tile.stamen.js?v1.3.0"),
	      tags$script(src="https://d3js.org/d3.v4.min.js"),
	      tags$script(src= "js/hungaryGEO.js")

	      # tags$script(src= "d3_demochart.js")
	    ),
	  fluidRow(
	  	column(9, class= "pull-left headerLogoCont", 
	  		tags$img(src= "img/logo-white.png", class="headerLogo"),
	  		tags$h1("Google Forms + R Shiny + D3.js dash", class="headerText")
	  		),
	  	column(3,
	  		tags$div(class="padded pull-right",
		  	    switchButton(inputId = "divider",
	                label = "Mindenki", 
	                value = FALSE, col = "GB", type = "OO")
	  		)
	  	)
	  ),
	  fluidRow(class = "fullRow",
	  	column(3,
	  		tags$div("HiflyScore", class="boxTitle"),
	  		wellPanel(
	  			tags$div(id="calculated_score"), class="container-box")
	  		),
	    column(5,
	    	tags$div("Területeink", class="boxTitle"),
	    	wellPanel(
	    		tags$div(id="shiny_field"), class="container-box")
	    	),
	    column(4,
	    	tags$div("Korfánk", class="boxTitle"),
	    	wellPanel(
	    		tags$div(id="shiny_agegender"), class="container-box")
	    	)
	  ),
	  fluidRow(class = "fullRow",
	    column(6,
	    	tags$div("Honnan jöttünk", class="boxTitle"),
	    	wellPanel(
	    		tags$div(id="shiny_map"), class="container-box")
	    	),
	    column(6,
	    	tags$div("Nehéz döntések", class="boxTitle"),
	    	wellPanel(
	    		tags$div(id="shiny_hobbies"), class="container-box")
	    	)
	  ),
	  tags$script(src= "js/visualizations.js"),
	  tags$link(rel = "stylesheet", type = "text/css", href= "https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css"),
	  tags$script(src = "https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js")
	)
)