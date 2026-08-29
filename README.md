# T-250 Steam Turbine Digital Twin
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#about-the-turbine">About the Turbine</a>
      <ul>
        <li>
          <a href="#key-specifications">Key Specifications</a>
        </li>
        <li>
          <a href="#main-application">Main Application</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#built-with">Built With</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li>
          <a href="#installation">Installation</a>
        </li>  
        <li>
          <a href="#application-launch">Application launch</a>
        </li>  
      </ul>
    </li>   
  </ol>
</details>

## About The Project
The purpose of this project is to implement digital twin of T-250 steam turbine, which is still in operation at Soviet-made power plants. Originally, this was a project for the Educational and Research Institute of Nuclear and Heat Power Engineering.

## About the Turbine
The **T-250/300-240** is a heavy-duty, single-shaft, supercritical district heating steam turbine. Designed for large-scale Cogeneration (Combined Heat and Power - CHP) plants, it simultaneously generates high-capacity electricity and thermal energy for industrial and residential district heating.

[T-250-image](https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Steam_turbine_T-250.jpg/1920px-Steam_turbine_T-250.jpg?utm_source=ru.wikipedia.org&utm_campaign=index&utm_content=thumbnail)

### Key Specifications
* **Type:** Cogeneration (CHP) Steam Turbine
* **Nominal Electrical Output:** 250 MW (Maximum up to 300–305 MW)
* **Live Steam Pressure:** 24 MPa (Supercritical)
* **Live Steam Temperature:** 540–560°C
* **Configuration:** 4 cylinders (1 HP, 1 IP, 2 LP)

### Main Application
This turbine is used in high-capacity power plants to maximize energy efficiency by utilizing exhaust steam for municipal district heating grids and industrial water heating.

## Built With
Languages & Markdown:
* [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
* [![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
* [![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)

Libraries:
* ![Three.js](https://img.shields.io/badge/threedotjs-%23000000.svg?style=for-the-badge&logo=threedotjs&logoColor=white)
* ![GSAP](https://img.shields.io/badge/gsap-%230AE448.svg?style=for-the-badge&logo=gsap&logoColor=white)

3D Modelling:
* ![Sketch Up](https://img.shields.io/badge/SketchUp-%23005F9E.svg?style=for-the-badge&logo=sketchup&logoColor=white)

## Getting Started

### Installation
1. Clone the repository
  ```sh
  git clone ttps://github.com/DaniilKhortov/T-250-Steam-Turbine-Digital-Twin.git
  ```  
2.Change the git remote (optional if you want to change your origin)
  ```sh
  git remote set-url origin https://github.com/DaniilKhortov/T-250-Steam-Turbine-Digital-Twin.git
  ```

### Application launch 
* To start the development server with hotfixes:
```bash
npm run dev
```
* To build the source code:
```bash
npm run build
```
*  To run `eslint` on the project code:
```bash
npm run lint
```
* To run `eslint` on the project code with any fixes:
```bash
npm run lint:fix
```
