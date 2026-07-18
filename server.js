const { createServer } = require("node:http");
const { readFile } = require("node:fs/promises");
const { extname, join, normalize } = require("node:path");

const puerto = Number(process.env.PORT || 4174);
const raiz = __dirname;
const tipos = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

const servidor = createServer(mostrarArchivo);

servidor.listen(puerto, function () {
  console.log(`SIPTEC frontend en http://localhost:${puerto}/index.html`);
  console.log("Backend Java corriendo en http://localhost:8080");
});

async function mostrarArchivo(request, response) {
  try {
    const url = new URL(request.url, `http://localhost:${puerto}`);
    const ruta = obtenerRuta(url.pathname);
    const archivo = await readFile(ruta);

    response.writeHead(200, {
      "Content-Type": tipos[extname(ruta)] || "application/octet-stream",
    });
    response.end(archivo);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Archivo no encontrado.");
  }
}

function obtenerRuta(pathname) {
  const limpio = pathname === "/" ? "/index.html" : pathname;
  const ruta = normalize(join(raiz, limpio));

  if (!ruta.startsWith(raiz)) {
    return join(raiz, "index.html");
  }

  return ruta;
}
