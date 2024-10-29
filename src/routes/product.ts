import { Router } from "express";
import db from "../db";
import cloudinary from "../cloudinary"; // Importa a configuração do Cloudinary

const router = Router();

// Recuperar todos os produtos
router.get("/products", async (req, res) => {
    try {
        const products = await db.product.findMany(); // Usando Prisma para buscar todos os produtos
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

// Atualizar um produto
router.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, banner } = req.body;

    try {
        // Atualiza o produto com base no id
        const updatedProduct = await db.product.update({
            where: { id }, // Prisma espera um 'string', então usamos o 'id' diretamente
            data: { name, banner }
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
});

// Excluir um produto
router.delete("/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Busca o produto pelo id para pegar a URL da imagem
        const product = await db.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        // Exclui a imagem do Cloudinary
        const publicId = product.banner.split('/').pop().split('.')[0]; // Extrai o publicId da URL
        await cloudinary.uploader.destroy(publicId);

        // Exclui o produto do banco de dados
        await db.product.delete({
            where: { id }
        });

        res.status(204).send(); // Envia resposta sem conteúdo
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir produto" });
    }
});

export default router;
