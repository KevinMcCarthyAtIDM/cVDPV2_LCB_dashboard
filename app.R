library(shiny)
library(plotly)
library(DT)
library(dplyr)

data <- read.csv("2025_06_05_summary.csv", stringsAsFactors = FALSE)

ui <- fluidPage(
  titlePanel("Type 2 Poliovirus Simulation Dashboard"),
  
  sidebarLayout(
    sidebarPanel(
      h4("Filter Options"),
      
      checkboxGroupInput("ri_filter", "Routine Immunization (RI):",
                         choices = c("No RI" = 0, "With RI" = 1),
                         selected = c(0, 1)),
      
      checkboxGroupInput("obr_filter", "Outbreak Response (OBR):",
                         choices = c("No OBR" = 0, "With OBR" = 1),
                         selected = c(0, 1)),
      
      h5("SIA (Supplementary Immunization Activities)"),
      
      checkboxInput("sia_enabled", "Include SIA scenarios", value = TRUE),
      
      conditionalPanel(
        condition = "input.sia_enabled",
        
        checkboxGroupInput("sia_frequency", "SIA Frequency:",
                           choices = c("Annual (1Y)" = "1Y", "Biennial (2Y)" = "2Y"),
                           selected = c("1Y", "2Y")),
        
        checkboxGroupInput("sia_extent", "SIA Geographic Extent:",
                           choices = c("All Nigeria" = "NGA", 
                                      "Northern Nigeria" = "NGAN", 
                                      "Lake Chad Basin" = "LKCHAD"),
                           selected = c("NGA", "NGAN", "LKCHAD")),
        
        checkboxGroupInput("sia_age_target", "SIA Age Target:",
                           choices = c("Up to Age 5" = "U5", "Under 2" = "U2"),
                           selected = c("U5", "U2"))
      ),
      
      hr(),
      
      h4("Highlight Options"),
      
      selectInput("highlight_var", "Highlight by:",
                  choices = c("None" = "none",
                             "Routine Immunization" = "RI",
                             "Outbreak Response" = "OBR",
                             "SIA Frequency" = "SIA_FREQ",
                             "SIA Geographic Extent" = "SIA_EXTENT",
                             "SIA Age Target" = "SIA_AGE"),
                  selected = "none"),
      
      conditionalPanel(
        condition = "input.highlight_var != 'none'",
        conditionalPanel(
          condition = "input.highlight_var == 'RI' || input.highlight_var == 'OBR'",
          selectInput("highlight_value", "Highlight value:",
                      choices = c("No" = 0, "Yes" = 1),
                      selected = 1)
        ),
        
        conditionalPanel(
          condition = "input.highlight_var == 'SIA_FREQ'",
          selectInput("highlight_value", "Highlight value:",
                      choices = c("Annual" = "1Y", "Biennial" = "2Y"),
                      selected = "1Y")
        ),
        
        conditionalPanel(
          condition = "input.highlight_var == 'SIA_EXTENT'",
          selectInput("highlight_value", "Highlight value:",
                      choices = c("All Nigeria" = "NGA", "Northern Nigeria" = "NGAN", "Lake Chad Basin" = "LKCHAD"),
                      selected = "NGA")
        ),
        
        conditionalPanel(
          condition = "input.highlight_var == 'SIA_AGE'",
          selectInput("highlight_value", "Highlight value:",
                      choices = c("Up to Age 5" = "U5", "Under 2" = "U2"),
                      selected = "U5")
        )
      ),
      
      hr(),
      
      checkboxInput("show_error_bars", "Show error bars", value = TRUE),
      
      width = 3
    ),
    
    mainPanel(
      tabsetPanel(
        tabPanel("Plot", 
                 plotlyOutput("scatter_plot", height = "600px")),
        tabPanel("Data Table", 
                 DTOutput("data_table")),
        tabPanel("Summary", 
                 verbatimTextOutput("summary"))
      ),
      width = 9
    )
  )
)

server <- function(input, output, session) {
  
  filtered_data <- reactive({
    df <- data
    
    df <- df[df$RI %in% as.numeric(input$ri_filter), ]
    df <- df[df$OBR %in% as.numeric(input$obr_filter), ]
    
    if (!input$sia_enabled) {
      df <- df[df$SIA.NGA == 0 & df$SIA.NGAN == 0 & df$SIA.LKCHAD == 0, ]
    } else {
      sia_rows <- c()
      
      for (freq in input$sia_frequency) {
        for (extent in input$sia_extent) {
          for (age in input$sia_age_target) {
            if (freq == "1Y" && extent == "NGA" && age == "U5") {
              sia_rows <- c(sia_rows, which(df$SIA.1Y == 1 & df$SIA.NGA == 1 & df$SIA.U2 == 0))
            } else if (freq == "1Y" && extent == "NGA" && age == "U2") {
              sia_rows <- c(sia_rows, which(df$SIA.1Y == 1 & df$SIA.NGA == 1 & df$SIA.U2 == 1))
            } else if (freq == "2Y" && extent == "NGA" && age == "U5") {
              sia_rows <- c(sia_rows, which(df$SIA.2Y == 1 & df$SIA.NGA == 1 & df$SIA.U2 == 0))
            } else if (freq == "2Y" && extent == "NGA" && age == "U2") {
              sia_rows <- c(sia_rows, which(df$SIA.2Y == 1 & df$SIA.NGA == 1 & df$SIA.U2 == 1))
            } else if (freq == "1Y" && extent == "NGAN" && age == "U5") {
              sia_rows <- c(sia_rows, which(df$SIA.1Y == 1 & df$SIA.NGAN == 1 & df$SIA.U2 == 0))
            } else if (freq == "1Y" && extent == "NGAN" && age == "U2") {
              sia_rows <- c(sia_rows, which(df$SIA.1Y == 1 & df$SIA.NGAN == 1 & df$SIA.U2 == 1))
            } else if (freq == "2Y" && extent == "NGAN" && age == "U5") {
              sia_rows <- c(sia_rows, which(df$SIA.2Y == 1 & df$SIA.NGAN == 1 & df$SIA.U2 == 0))
            } else if (freq == "2Y" && extent == "NGAN" && age == "U2") {
              sia_rows <- c(sia_rows, which(df$SIA.2Y == 1 & df$SIA.NGAN == 1 & df$SIA.U2 == 1))
            } else if (freq == "1Y" && extent == "LKCHAD" && age == "U5") {
              sia_rows <- c(sia_rows, which(df$SIA.1Y == 1 & df$SIA.LKCHAD == 1 & df$SIA.U2 == 0))
            } else if (freq == "1Y" && extent == "LKCHAD" && age == "U2") {
              sia_rows <- c(sia_rows, which(df$SIA.1Y == 1 & df$SIA.LKCHAD == 1 & df$SIA.U2 == 1))
            } else if (freq == "2Y" && extent == "LKCHAD" && age == "U5") {
              sia_rows <- c(sia_rows, which(df$SIA.2Y == 1 & df$SIA.LKCHAD == 1 & df$SIA.U2 == 0))
            } else if (freq == "2Y" && extent == "LKCHAD" && age == "U2") {
              sia_rows <- c(sia_rows, which(df$SIA.2Y == 1 & df$SIA.LKCHAD == 1 & df$SIA.U2 == 1))
            }
          }
        }
      }
      
      no_sia_rows <- which(df$SIA.NGA == 0 & df$SIA.NGAN == 0 & df$SIA.LKCHAD == 0)
      all_rows <- unique(c(sia_rows, no_sia_rows))
      df <- df[all_rows, ]
    }
    
    return(df)
  })
  
  output$scatter_plot <- renderPlotly({
    df <- filtered_data()
    
    if (nrow(df) == 0) {
      return(plotly_empty())
    }
    
    df$hover_text <- paste(
      "<b>", gsub("experiment_cVDPV2_100km_base_?", "", df$NAME), "</b><br>",
      "Cases (Mean):", df$CASES_MU, "<br>",
      "Cases (Range):", df$CASES_LO, "-", df$CASES_HI, "<br>",
      "Cost:", df$COST, "<br>",
      "RI:", ifelse(df$RI == 1, "Yes", "No"), "<br>",
      "OBR:", ifelse(df$OBR == 1, "Yes", "No"), "<br>",
      "SIA-NGA:", ifelse(df$SIA.NGA == 1, "Yes", "No"), "<br>",
      "SIA-NGAN:", ifelse(df$SIA.NGAN == 1, "Yes", "No"), "<br>",
      "SIA-LKCHAD:", ifelse(df$SIA.LKCHAD == 1, "Yes", "No"), "<br>",
      "SIA-U2:", ifelse(df$SIA.U2 == 1, "Under 2", "Up to Age 5"), "<br>",
      "SIA-1Y:", ifelse(df$SIA.1Y == 1, "Yes", "No"), "<br>",
      "SIA-2Y:", ifelse(df$SIA.2Y == 1, "Yes", "No")
    )
    
    if (input$highlight_var != "none") {
      if (input$highlight_var == "SIA_FREQ") {
        if (input$highlight_value == "1Y") {
          df$highlight <- ifelse(df$SIA.1Y == 1, "Highlighted", "Other")
        } else {
          df$highlight <- ifelse(df$SIA.2Y == 1, "Highlighted", "Other")
        }
      } else if (input$highlight_var == "SIA_EXTENT") {
        if (input$highlight_value == "NGA") {
          df$highlight <- ifelse(df$SIA.NGA == 1, "Highlighted", "Other")
        } else if (input$highlight_value == "NGAN") {
          df$highlight <- ifelse(df$SIA.NGAN == 1, "Highlighted", "Other")
        } else if (input$highlight_value == "LKCHAD") {
          df$highlight <- ifelse(df$SIA.LKCHAD == 1, "Highlighted", "Other")
        }
      } else if (input$highlight_var == "SIA_AGE") {
        if (input$highlight_value == "U2") {
          df$highlight <- ifelse(df$SIA.U2 == 1, "Highlighted", "Other")
        } else {
          df$highlight <- ifelse(df$SIA.U2 == 0, "Highlighted", "Other")
        }
      } else {
        highlight_col <- input$highlight_var
        highlight_val <- as.numeric(input$highlight_value)
        df$highlight <- ifelse(df[[highlight_col]] == highlight_val, "Highlighted", "Other")
      }
      color_var <- ~highlight
      colors <- c("Highlighted" = "red", "Other" = "lightblue")
    } else {
      color_var <- I("steelblue")
      colors <- NULL
    }
    
    p <- plot_ly(df, x = ~COST, y = ~CASES_MU, 
                 text = ~hover_text,
                 hoverinfo = "text",
                 color = color_var,
                 colors = colors,
                 type = "scatter",
                 mode = "markers",
                 marker = list(size = 8, opacity = 0.7)) %>%
      layout(title = "Cost vs Cases",
             xaxis = list(title = "Cost"),
             yaxis = list(title = "Cases (Mean)"),
             showlegend = ifelse(input$highlight_var != "none", TRUE, FALSE))
    
    if (input$show_error_bars) {
      p <- p %>% add_trace(x = ~COST, y = ~CASES_MU,
                          error_y = list(type = "data", 
                                        symmetric = FALSE,
                                        array = ~(CASES_HI - CASES_MU),
                                        arrayminus = ~(CASES_MU - CASES_LO)),
                          type = "scatter",
                          mode = "markers",
                          marker = list(color = "transparent"),
                          showlegend = FALSE,
                          hoverinfo = "skip",
                          name = "Error bars")
    }
    
    return(p)
  })
  
  output$data_table <- renderDT({
    df <- filtered_data()
    
    df_display <- df %>%
      select(NAME, CASES_MU, CASES_LO, CASES_HI, COST, RI, OBR, 
             SIA.NGA, SIA.NGAN, SIA.LKCHAD, SIA.U2, SIA.1Y, SIA.2Y) %>%
      mutate(
        RI = ifelse(RI == 1, "Yes", "No"),
        OBR = ifelse(OBR == 1, "Yes", "No"),
        `SIA-NGA` = ifelse(SIA.NGA == 1, "Yes", "No"),
        `SIA-NGAN` = ifelse(SIA.NGAN == 1, "Yes", "No"),
        `SIA-LKCHAD` = ifelse(SIA.LKCHAD == 1, "Yes", "No"),
        `SIA-U2` = ifelse(SIA.U2 == 1, "Under 2", "Up to Age 5"),
        `SIA-1Y` = ifelse(SIA.1Y == 1, "Yes", "No"),
        `SIA-2Y` = ifelse(SIA.2Y == 1, "Yes", "No")
      ) %>%
      select(-SIA.NGA, -SIA.NGAN, -SIA.LKCHAD, -SIA.U2, -SIA.1Y, -SIA.2Y)
    
    datatable(df_display, 
              options = list(scrollX = TRUE, pageLength = 15),
              rownames = FALSE) %>%
      formatRound(columns = c("CASES_MU", "COST"), digits = 1)
  })
  
  output$summary <- renderText({
    df <- filtered_data()
    
    if (nrow(df) == 0) {
      return("No data matches the current filters.")
    }
    
    paste(
      "Summary Statistics for Filtered Data:\n",
      "Number of simulations:", nrow(df), "\n\n",
      "Cases (Mean):\n",
      "  Min:", min(df$CASES_MU), "\n",
      "  Max:", max(df$CASES_MU), "\n",
      "  Mean:", round(mean(df$CASES_MU), 1), "\n",
      "  Median:", round(median(df$CASES_MU), 1), "\n\n",
      "Cost:\n",
      "  Min:", min(df$COST), "\n",
      "  Max:", max(df$COST), "\n",
      "  Mean:", round(mean(df$COST), 1), "\n",
      "  Median:", round(median(df$COST), 1), "\n\n",
      "Intervention Combinations:\n",
      "  With RI:", sum(df$RI == 1), "\n",
      "  With OBR:", sum(df$OBR == 1), "\n",
      "  With SIA-NGA:", sum(df$SIA.NGA == 1), "\n",
      "  With SIA-NGAN:", sum(df$SIA.NGAN == 1), "\n",
      "  With SIA-LKCHAD:", sum(df$SIA.LKCHAD == 1)
    )
  })
}

shinyApp(ui = ui, server = server)