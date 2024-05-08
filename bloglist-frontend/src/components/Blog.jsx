const Blog = ({ blog }) => (
  <div className="row">
    {blog.title} {blog.author}
  </div>  
)

export default Blog