import { Router } from "express";
import checkAuthMiddleware from "../middlewares/authMiddleware.mjs"

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
postRouter.get("/api/posts", (req, res) => {
  
  res.status(200).json(posts);
});


// * public
postRouter.get("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  const foundPost = posts.filter((p) => p.id === +id);
  
  if (foundPost.length) {
    res.json(foundPost[0]);
    return;
  }

  res.status(404).json({ message: "Post not found!" });
});

// ! restricted / auth 
postRouter.post("/api/posts", checkAuthMiddleware(["admin", "author"]), (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    posted: "24/08/2024",
  };
  
  posts.push(newPost);
  res.status(201).json({message:"post created successfully"})
});


// ! restricted / auth 
postRouter.delete('/api/posts/:id',  checkAuthMiddleware(["admin", "author"]), (req, res)=>{
  const {id} = req.params;
  if(+id > posts.length) return res.status(404).json({message: "post you are trying to delete doesn't exists!"});
  
  posts = posts.filter(post=> post.id !== +id);
  res.sendStatus(204);
});


// ! restricted / auth 
postRouter.put("/api/posts/:id",  checkAuthMiddleware(["admin", "author"]), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  const post = posts.find(p => p.id === +id);
  console.log(post);

  if (!post) {
    return res.status(404).json({ message: "Post not found!" });
  }

  // Update fields if provided
  if (title) post.title = title;
  if (content) post.content = content;
  post.posted = new Date().toLocaleDateString();  // Set to current date

  res.status(200).json({ message: "Post updated successfully", post });
});


export default postRouter;
