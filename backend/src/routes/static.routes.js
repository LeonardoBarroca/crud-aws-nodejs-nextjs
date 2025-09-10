import { getStaticFileStream } from "../static/static-file.service.js";

export default async function staticRoutes(fastify) {
  fastify.get("/static/:filename", async (request, reply) => {
    const { filename } = request.params;
    try {
      const stream = await getStaticFileStream(filename);
      if (!stream) {
        fastify.log.error(`Arquivo não encontrado no S3: ${filename}`);
        return reply.code(404).send({ error: "File not found" });
      }
      reply.header("Content-Type", "application/octet-stream");
      reply.header("Content-Disposition", `attachment; filename="${filename}"`);
      return reply.send(stream);
    } catch (err) {
      fastify.log.error(`Erro ao buscar arquivo "${filename}":`, err);
      return reply.code(404).send({ error: "File not found", details: err?.message || err });
    }
  });
}
