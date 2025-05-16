provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "resume-webapp-rg"
  location = "East US"
}

resource "azurerm_static_site" "resume_site" {
  name                = "resume-hosting-${random_integer.rand.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_size            = "Free"
  sku_tier            = "Free"
  repository_url      = "https://github.com/YOUR_GITHUB_USERNAME/YOUR_RESUME_REPO"
  branch              = "main"

  build_properties {
    app_location = "/"
  }
}

resource "random_integer" "rand" {
  min = 1000
  max = 9999
}
