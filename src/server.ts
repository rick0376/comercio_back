import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors';
import cors from 'cors';
import path from 'path'

import { router } from './routes'
import fileUpload from 'express-fileupload'

import categoryRouter from "./routes/category"; // Importa a rota de categorias
import categoryRoutes from "./routes/category"; // Importa as rotas de categoria
import productRouter from "./routes/product"; // Importa a rota de produtos


const app = express();
app.use(express.json());
app.use(cors());
//codigo para cloudinary
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }  // No maximo de 50 mb
}))

app.use("/api/categories", categoryRouter); // Adiciona a rota de categorias
app.use("/api/products", productRouter); // Adiciona a rota de produtos

app.use(router);

app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp'))
)


// Usa as rotas de categorias
app.use("/api", categoryRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    //Se for uma instancia do tipo error
    return res.status(400).json({
      error: err.message
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.'
  })

})

//app.listen(3333, () => console.log('Servidor online!!!!'))
app.listen(process.env.PORT, () => console.log('Servidor online!!!!'))