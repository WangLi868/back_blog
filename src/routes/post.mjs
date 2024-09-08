import { json, Router } from "express";
import checkAuthMiddleware from "../middlewares/authMiddleware.mjs";
import prisma from "../utils/db.mjs";

const postRouter = Router();

/**
 * {
 *  title: string,
 *  content: string,
 *  posted: date,
 * }
 */

let posts = [
  {
    id: 1,
    title: "first post",
    content:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas Letraset, las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.",
    posted: "15/08/2024",
  },
  {
    id: 2,
    title: "second post",
    content:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas Letraset, las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.",
    posted: "24/08/2024",
  },
];

// * public
postRouter.get("/api/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, createdAt: true },
  });
  res.status(200).json(posts);
});

// * public
postRouter.get("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundPost = await prisma.post.findUnique({
      where: { id: +id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: { select: { username: true } },
      },
    });

    if (foundPost) {
      return res.json(foundPost);
    }
    return res.status(404).json({ message: "post not found!" });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

// ! restricted / auth
postRouter.post(
  "/api/posts",
  //  checkAuthMiddleware(["admin", "author"]),
  async (req, res) => {
    const { title, content, authorId } = req.body;
    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          authorId: +authorId,
        },
      });
      if (newPost)
        return res.status(201).json({ message: "post created successfully!" });
      throw new Error("Cloud not create new post.");
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
);

// ! restricted / auth
postRouter.delete(
  "/api/posts/:id",
  checkAuthMiddleware(["admin", "author"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletePost=await prisma.post.delete({
        where: {
          id: +id,
        },
      });
      if(deletePost)
        return res.json({ message: "Post Deleted Successfully" });
    } catch (e) {
      res.status(500).json({ error: e });
    }
    
  }
);

// ! restricted / auth
postRouter.put(
  "/api/posts/:id",
  checkAuthMiddleware(["admin", "author"]),
  async(req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      const updatePost=await prisma.post.update({
        where:{id:+id},
        data: {title,content}
      })
      if(updatePost){
        res.status(200).json({ message: "Post updated successfully"});
      }
    } catch (e) {
      return res.status(500).json({error:e});
    }
      
    


  }
);

export default postRouter;
