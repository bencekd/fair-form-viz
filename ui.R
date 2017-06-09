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
	  fluidRow(
	  	column(12, class= "pull-left headerLogoCont", 
	  		tags$img(src= "img/logo-white.png", class="headerLogo")
	  		)
	  	),
	  fluidRow(class = "fullRow",
	    column(6,
	    	wellPanel(
	    		tags$div(id="shiny_field"), class="container-box")
	    	),
	    column(6,
	    	wellPanel(
	    		tags$div(id="shiny_agegender"), class="container-box")
	    	)
	  ),
	  fluidRow(class = "fullRow",
	    column(6,
	    	wellPanel(
	    		tags$div(id="shiny_map"), class="container-box")
	    	),
	    column(6,
	    	wellPanel(
	    		tags$div(id="shiny_hobbies"), class="container-box")
	    	)
	  ),
	  tags$script(src= "js/visualizations.js")
	)
)

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
	  fluidRow(
	  	column(12, class= "pull-left headerLogoCont", 
	  		tags$img(src= "img/logo-white.png", class="headerLogo"),
	  		tags$h1("Google Forms + R Shiny + D3.js dash", class="headerText")
	  		)
	  	),
	  fluidRow(class = "fullRow",
	    column(6,
	    	tags$div("Hello", class="boxTitle"),
	    	wellPanel(
	    		tags$div(id="shiny_field"), class="container-box")
	    	),
	    column(6,
	    	tags$div("Hello", class="boxTitle"),
	    	wellPanel(
	    		tags$div(id="shiny_agegender"), class="container-box")
	    	)
	  ),
	  fluidRow(class = "fullRow",
	    column(6,
	    	tags$div("Hello", class="boxTitle"),
	    	wellPanel(
	    		tags$div(id="shiny_map"), class="container-box")
	    	),
	    column(6,
	    	tags$div("Hello", class="boxTitle"),
	    	wellPanel(
	    		tags$div(id="shiny_hobbies"), class="container-box")
	    	)
	  ),
	  tags$script(src= "js/visualizations.js")
	)