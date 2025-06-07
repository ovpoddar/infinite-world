# infinite-world

A exploring project to discover the boundaries of infinite procedural generation, compiled and run using WebAssembly (WASM).

---

## Requirements

Before building or running the project, ensure you have the following tools installed:

- **[wasm-tools](https://github.com/bytecodealliance/wasm-tools)**  
  A suite of command-line tools for working with WebAssembly binaries.

- **wasm-tools-net8**  
  A .NET 8 compatible integration of `wasm-tools`.

> **Important:**  
> Do **not** clone or place this project in an unusual or deeply nested path.  
> Keep the folder in a **simple and short directory** (e.g., `C:\wasm\infinite-world` or `~/wasm/infinite-world`)  

---

## Setup

Clone the repository:

```bash
git clone https://github.com/your-username/infinite-world.git
dotnet workload list // check wasm-tools-net8 and wasm-tools
dotnet workload install wasm-tools-net8 // if workload doesnt installed. 
dotnet workload install wasm-tools
cd infinite-world
dotnet run