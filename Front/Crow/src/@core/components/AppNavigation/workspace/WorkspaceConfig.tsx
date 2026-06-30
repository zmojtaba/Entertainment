export interface Workspace {
  id: string
  name: string
  title: string
  logo: string
  palette: string
}

const workspaces: Workspace[] = [
  {
    id: "hamrah",
    name: "hamrah",
    title: "همراه",
    logo: "hamrah-logo.svg",
    palette: "light"
  },
  {
    id: "data",
    name: "data",
    title: "داده",
    logo: "data-logo.svg",
    palette: "light"
  }
]


export default workspaces