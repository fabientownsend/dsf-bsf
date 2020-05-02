const { useState, useEffect } = React;
import { Layout, Radio, Row, Col } from "antd";

const { Header, Sider, Content } = Layout;

const size = 10;
export default function Index() {
  const [dfs, setDfs] = useState("pop");
  const [start, setStart] = useState([2, 2]);
  const [size, setSize] = useState("dfs");

  function handleSizeChange(e) {
    const { value } = e.target;
    if (value === "dfs") {
      setSize("dfs");
      setDfs("pop");
    } else {
      setSize("bfs");
      setDfs("shift");
    }
  }

  function startingPoint(row, col) {
    setStart([row, col]);
  }

  return (
    <Layout>
      <Sider style={{ background: "white" }} />
      <Layout>
        <Header style={{ background: "white" }}>
          <Radio.Group value={size} onChange={handleSizeChange}>
            <Radio.Button value="dfs">Deep First Search</Radio.Button>
            <Radio.Button value="bfs">Breadth First Search</Radio.Button>
          </Radio.Group>
        </Header>
        <Content>
          <Logic fn={dfs} start={start} startingPoint={startingPoint} />
        </Content>
      </Layout>
      <Sider style={{ background: "white" }} />
    </Layout>
  );
}

function Logic({ fn, startingPoint, start }) {
  const [view, setView] = useState([]);

  useEffect(() => {
    const frames = exploreArray();
    const interval = setInterval(() => {
      console.log(frames.length);
      if (frames.length > 0) {
        setView(frames.shift());
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [fn, start]);

  function exploreArray() {
    const arr = new Array(size)
      .fill(false)
      .map(() => new Array(size).fill(false));
    const views = [arr];

    const directions = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0]
    ];

    const list = [start];
    while (list.length > 0) {
      const [rowToVisit, colToVisit] = list[fn]();

      if (
        isInside(rowToVisit, colToVisit) &&
        arr[rowToVisit][colToVisit] !== true
      ) {
        arr[rowToVisit][colToVisit] = true;
        views.push(JSON.parse(JSON.stringify(arr)));

        for (let [rowDirection, colDirection] of directions) {
          const newRowToVisit = rowToVisit + rowDirection;
          const newColToVisit = colToVisit + colDirection;
          list.push([newRowToVisit, newColToVisit]);
        }
      }
    }

    return views;
  }

  function isInside(row, col) {
    return row >= 0 && row < size && col >= 0 && col < size;
  }

  return <RenderTable arr={view} startingPoint={startingPoint} />;
}

function RenderTable({ arr, startingPoint }) {
  const width = 1041 / size;
  const rows = arr.map((e, row) => {
    return (
      <Row gutter={[1, 1]}>
        {e.map((z, col) => {
          return (
            <Col key={col.toString()} row={1}>
              <div
                onClick={() => startingPoint(row, col)}
                style={
                  z
                    ? { backgroundColor: "#0092ff", height: `${width}px` }
                    : { backgroundColor: "#f2f2f2", height: `${width}px` }
                }
              />
            </Col>
          );
        })}
      </Row>
    );
  });

  return <>{rows}</>;
}
