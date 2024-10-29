import { Router } from "express";
import db from "../db"; // Importa o Prisma Client

const router = Router();

// Recuperar todas as categorias
router.get("/categories", async (req, res) => {
    try {
        const categories = await db.category.findMany(); // Usando o modelo do Prisma
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar categorias" });
    }
});

// Atualizar uma categoria
router.put("/categories/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        // Atualiza a categoria com base no id
        const updatedCategory = await db.category.update({
            where: { id }, // Prisma espera um 'string', então usamos 'id' diretamente
            data: { name }
        });

        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
});

// Excluir uma categoria
router.delete("/categories/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Exclui a categoria com base no id
        await db.category.delete({
            where: { id } // Prisma espera um 'string', então usamos 'id' diretamente
        });

        res.status(204).send(); // Envia resposta sem conteúdo
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir categoria" });
    }
});

export default router;
