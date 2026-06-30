import styled from "@emotion/styled"


export const ContainerFluid = styled.div`
  position: absolute;
  top: 20px;
  opacity: 0.5;
  width: 100%;
  height: calc(100% - 20px);;
  display: flex;
  justify-content: center;
  z-index: 2;
`

export const Container = styled.div`
  width: calc(100% - 20px);
  height: 100%;
  position: relative;
  padding: 0;
`

export const DraggableBox = styled.div`
  background: #226eff;
  min-width: 10px;
  width: 100%;
  height: 100%;
`