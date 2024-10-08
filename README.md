<p align="center">
   <br/>
   <img width="250px" src="https://i.imgur.com/d6R7lAA.png" />
   <h1 align="center" id="band" style="margin-bottom: 0; border-bottom: none;c">Band</h1>
   <p align="center" style="font-size: larger; opacity: 0.75;">a modern acoustic simulator</p>
</p>

⚠️ **This is a work in progress, many things are not working / not implemented yet** 

v0.1.0

## About

Band is an application that allows users to simulate and explore various acoustic properties of a modeled space. This is essentially a rewrite of [cram](https://github.com/gregzanch/cram)

### Features
- Interactive 3D model editor 
- Diverse set of solvers
- Comprehensive material library
- Upload your own custom materials
- Automatic project saving
- Cloud storage
- Result visualization and data export
- Spatial auralization

### Solvers
- Statistical Reverberation time using Sabine, Eyring, and Arau-Puchades methods
- Stochastic Ray Tracing to produce an impulse response
- Image Source Method for early reflection analysis
- Finite Difference Time Domain for modal analysis 

## Design Goals

### Intuitive

should have an intuitive user interface, and should follow the design patterns of modern 3D CAD software ([SketchUp](https://www.sketchup.com/), [Blender](https://www.blender.org/), [Fusion 360](https://www.autodesk.com/products/fusion-360/overview), etc.)

### Interactive

should have an interactive model editor with easy to use navigation, selection, and transformation controls.

### Responsive

should always be responsive to parameter changes which are reflected in the model editor. For example, user should be allowed to change a source's position while recording a FDTD simulation.

### Free

should be free and open source using [MIT license](https://choosealicense.com/licenses/mit/)

### Cross Platform

should run in a modern browser (Chrome, Firefox, Brave, Safari, Edge), and on most platforms (macOS, Windows, Linux, iOS, Android, Raspbian)

### Solution Diversity

should provide a diverse set of solution/simulation types, namely:

- Reverberation time using various equations (Sabine, Eyring, Arau-Puchades, etc.)
- Geometric Acoustics
    - Stochastic Ray Tracing (Monte-Carlo / Diffuse Rain)
    - Image Source Method
    - [Acoustic Radiosity and Radiance Transfer](http://interactiveacoustics.info/html/GA_radiance.html#)
- Wave Based Solutions
    - FDTD in 2 dimensions with various boundary conditions ([Neumann](https://en.wikipedia.org/wiki/Neumann_boundary_condition), Open/[PML](https://en.wikipedia.org/wiki/Perfectly_matched_layer))

### Material Diversity

should provide access to a large material database with modern search tools

### Simple IO

should have saving/loading functionality using human readable/editable JSON, as well as state persistence using local storage.

### Result Export

should be able to export solution results to various formats:

- Tabularized (.csv, .txt)
- Spreadsheet (.xlsx)
- Image (.svg, .png, .gif)
- Audio (.wav)

### Import Diversity

should be able to read various 3d mesh file types, namely: 

- Wavefront (OBJ)
- GLTF
- STL
- Collada (DAE)
- PLY

### Result Visualization

should be able to view results using various chart types or visually in the model editor