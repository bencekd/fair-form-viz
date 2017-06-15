library(shiny)
source("./Rsource/SwitchButton.R")

shinyUI(
	fluidPage( id="main-container",
	  tags$head(
	      tags$link(rel = "stylesheet", type = "text/css", href = "styles/main-styles.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "styles/bootstrap.min.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "https://fonts.googleapis.com/css?family=Roboto+Condensed"),
	      tags$link(rel = "stylesheet", type = "text/css", href = "styles/button.css"),

	      tags$script(src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"),
	      tags$script(src="https://d3js.org/d3.v4.min.js"),
	      tags$script(src= "js/hungaryGEO.js")

	      # tags$script(src= "d3_demochart.js")
	    ),
	  tags$div( class = "screen"),
	  tags$div( class="sk-cube-grid",
	    tags$div( class="sk-cube sk-cube1" ),
	    tags$div( class="sk-cube sk-cube2" ),
	    tags$div( class="sk-cube sk-cube3" ),
	    tags$div( class="sk-cube sk-cube4" ),
	    tags$div( class="sk-cube sk-cube5" ),
	    tags$div( class="sk-cube sk-cube6" ),
	    tags$div( class="sk-cube sk-cube7" ),
	    tags$div( class="sk-cube sk-cube8" ),
	    tags$div( class="sk-cube sk-cube9" )
	  ),
	  tags$div(class="col-md-2 container-left",
	  	tags$div(class="headerLogoCont",
	  		tags$img(src= "img/logo-white.png", class="headerLogo")
	  	),
	  	tags$div(class="left-container-box", 
	  		tags$div(class="hifly-title", tags$b("hifly"), " score"),
	  		tags$div(id="calculated_score")
	  	),
	  	tags$div(class="dataSwitch",
	  	    switchButton(inputId = "divider",
                label = "Mindenki", 
                value = FALSE, col = "GB", type = "OO"),
	  	    tags$a(href="https://github.com/bencekd/fair-form-viz", target = "_blank", "Source & Copyright")
	  	 )
	  ),
	  tags$div(class="col-md-10 container-right",
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
	  	  )
	  ),
	  tags$script(src= "js/visualizations.js"),
	  tags$link(rel = "stylesheet", type = "text/css", href= "https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css"),
	  tags$script(src = "https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js")
	)
)