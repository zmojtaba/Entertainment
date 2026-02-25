import BrowserRouter from "@core/components/BrowserRouter"
import AppAuthorization from "@core/components/Authorization"
import FuseLayout from "@core/components/AppLayout"
import AppTheme from "@core/components/AppTheme"
import { useSelector } from "react-redux"
import rtlPlugin from "stylis-plugin-rtl"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { selectCurrLangDir } from "app/store/i18nSlice"
import withAppProviders from "./withAppProviders"
import { Auth } from "./auth"
import { ToastContainer } from "react-toastify"
import ErrorBoundary from "app/shared-components/error-boundary/ErrorBoundary"
import "react-toastify/dist/ReactToastify.css"
import "app/services/utils/custom-scripts"
import { type CustomTableToolbarProps } from "./shared-components/custom-table-toolbar"
import { useEffect, useLayoutEffect } from "react"

// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*"

declare global {
  interface String {
    toTimeFormat(): string;
  }
  interface HTMLElement {
    printMe(): void;
    execAnimation(name: string): Promise<HTMLElement>;
  }
}

declare module '@mui/x-data-grid' {
  interface PaginationPropsOverrides {
    showGoto: boolean,
    showPaginationInfo: boolean,
    showPageSize: boolean,
    rowsPerPageOptions: number[],
    boundaryCount: number
  }
  interface ToolbarPropsOverrides extends CustomTableToolbarProps {

  }
  interface NoRowsOverlayPropsOverrides {
    title: string
  }
}

const emotionCache = {
  LTR: createCache({
    key: "ltr",
    insertionPoint: document.getElementById("emotion-insertion-point") as
      | HTMLElement
      | undefined
  }),
  RTL: createCache({
    key: "rtl",
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById("emotion-insertion-point") as
      | HTMLElement
      | undefined
  })
}



const App = () => {
  const langDirection = useSelector(selectCurrLangDir)
  // const selectedCache = langDirection !== "rtl" ? emotionCache.LTR : emotionCache.RTL;
  const selectedCache = emotionCache.LTR;


  useEffect(() => {
    console.log('target', document.readyState)

    const allElements = document.querySelectorAll('*[data-press]');
    console.log({ allElements })
  }, [])


  return (
    <CacheProvider value={selectedCache}>
      <ErrorBoundary>
        <Auth>
          <BrowserRouter>
            <AppAuthorization>
              <AppTheme>
                <FuseLayout />
              </AppTheme>
            </AppAuthorization>
          </BrowserRouter>
        </Auth>
        <ToastContainer limit={3} rtl={false} position="bottom-right" closeOnClick />
      </ErrorBoundary>
    </CacheProvider>
  )
}

export default withAppProviders(App)()
