import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { AuthProvider } from "./features/auth/auth.context"
import "./features/shared/global.scss"
import { PostContextProvider } from "./features/posts/post.context"
import ErrorBoundary from "./ErrorBoundary"


function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <PostContextProvider>
          <RouterProvider router={router} />
        </PostContextProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App