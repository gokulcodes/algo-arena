import { useState } from 'react'

interface tuple {
  first: number
  second: number
}

interface Lib {
  name: string
  theory: string
  key: string
}

let ROW: number = 26,
  COL: number = 60

const AlgoLib: { [index: string]: Lib } = {
  bfs: {
    name: 'Breadth First Search',
    theory:
      'Breadth First Search use a technique that visits the adjacent nodes of nodes to find the path. It is mainly used to find shortest distance between two points.',
    key: 'bfs',
  },
}

function App() {
  const [visited, setVisited] = useState<boolean[][]>(
    new Array(ROW).fill(false).map(() => new Array(COL).fill(false)),
  )
  const [algo, setAlgo] = useState<string>('bfs')
  const [current, setCurrent] = useState<tuple>({ first: -1, second: -1 })
  const [source, setSouce] = useState<tuple>({
    first: -1,
    second: -1,
  })
  const [destination, setDestination] = useState<tuple>({
    first: -1,
    second: -1,
  })
  const [speed, setSpeed] = useState<number>(100)

  const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }

  const sourceDestinationCheck = (): boolean =>
    source.first === -1 ||
    source.second === -1 ||
    destination.first === -1 ||
    destination.second === -1

  const reset = () => {
    setVisited(new Array(ROW).fill(false).map(() => new Array(COL).fill(false)))
    setSouce({
      first: -1,
      second: -1,
    })
    setDestination({
      first: -1,
      second: -1,
    })
  }

  const BreathFirstSearch = async () => {
    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    let q: [tuple] = [source]
    let vis = visited
    vis[q[0].first][q[0].second] = true
    setVisited(vis)

    while (q.length > 0) {
      let top = q.at(0)
      q.shift()

      if (top) {
        for (let dir of directions) {
          let dx: number = dir[0] + top?.first,
            dy: number = dir[1] + top?.second

          if (dx >= 0 && dy >= 0 && dx < ROW && dy < COL) {
            if (visited[dx][dy]) {
              continue
            }

            setCurrent({
              first: dx,
              second: dy,
            })

            q.push({ first: dx, second: dy })
            await sleep(speed)

            let vis = visited
            vis[dx][dy] = true
            setVisited(vis)

            if (dx === destination.first && dy === destination.second) {
              console.log(dx, dy)
              return
            }
          }
        }
      }

      console.log(q)
    }
  }

  return (
    <>
      <div className="flex flex-row w-full items-center p-4 justify-between h-14 text-white bg-gray-800 absolute z-50 top-0">
        <h1 className="text-white text-xl font-nerd font-bold">
          Algo Visalizers
        </h1>
        <div className="flex flex-row">
          <div className="select-wrapper">
            <select
              defaultValue={algo}
              className="bg-gray-900 px-4 pr-8 font-nerd rounded-md py-2 mr-2"
              onChange={(e) => {
                setAlgo(e.target.value)
              }}
            >
              <option value="bfs">Breadth First Search</option>
              <option value="dfs">Depth First Search</option>
              <option value="a*">A*</option>
              <option value="dijikstra">Dijikstra</option>
            </select>
          </div>
          <button
            className={`px-4 py-2 ${
              !sourceDestinationCheck()
                ? 'opacity-100 animate-pop'
                : 'opacity-40'
            } bg-green-600 text-md rounded-lg font-nerd `}
            disabled={sourceDestinationCheck()}
            onClick={() => {
              BreathFirstSearch()
            }}
          >
            Visualize
          </button>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="select-wrapper">
            <select
              defaultValue={speed}
              className="bg-black px-4 pr-8 rounded-md py-2 mr-2 font-nerd"
              onChange={(e) => {
                setSpeed(Number(e.target.value))
              }}
            >
              <option className="font-nerd" value="100">
                Slow
              </option>
              <option className="font-nerd" value="50">
                Medium
              </option>
              <option className="font-nerd" value="10">
                Fast
              </option>
            </select>
          </div>
          <button
            className="px-4 py-2 bg-black text-md rounded-lg font-nerd"
            onClick={() => reset()}
          >
            Clear
          </button>
        </div>
      </div>

      <div
        className="flex flex-col items-center justify-end w-full bg-gray-900 overflow-hidden h-full"
        style={{ height: '100vh' }}
      >
        {AlgoLib?.[algo] !== undefined ? (
          <>
            <p className="font-nerd text-white font-bold text-lg mb-5">
              {sourceDestinationCheck()
                ? 'Select source and destination points'
                : AlgoLib[algo].name}
            </p>
            <div className="flex flex-row items-center justify-between w-1/3">
              <p className="font-nerd text-white flex flex-row items-center justify-center">
                <span className="text-4xl mr-2">💠</span> Source: (
                {source.first}, {source.second})
              </p>
              <p className="font-nerd text-white text-3xl">→</p>
              <p className="font-nerd text-white flex flex-row items-center justify-center">
                <span className="text-4xl mr-2">🚩</span> Destination: (
                {destination.first}, {destination.second})
              </p>
            </div>
            <p className="text-md font-nerd text-white text-center w-4/6 mt-5 mb-8 opacity-60">
              {AlgoLib[algo].theory}
            </p>
            {visited.map((r, i1) => (
              <div className="flex flex-row items-center justify-center">
                {visited[i1].map((c, i2) => (
                  <div
                    className={`w-6 h-6 cursor-pointer flex items-center justify-center ${
                      current.first === i1 && current.second === i2
                        ? 'bg-yellow-400 scale-150 z-50'
                        : visited[i1][i2]
                        ? 'bg-gray-600 border-[1px] border-gray-800 animate-opac'
                        : 'border-[1px] border-gray-700'
                    } ${
                      (source.first === i1 && source.second === i2) ||
                      (destination.first === i1 && destination.second === i2)
                        ? 'z-10'
                        : ''
                    } transform transition-all `}
                    onClick={() => {
                      if (source.first === -1 && source.second === -1) {
                        setSouce({ first: i1, second: i2 })
                      } else if (
                        destination.first === -1 &&
                        destination.second === -1
                      ) {
                        setDestination({ first: i1, second: i2 })
                      }
                    }}
                  >
                    <p
                      className={`${
                        destination.first === i1 && destination.second === i2
                          ? 'text-6xl ml-12 mb-12 origin-bottom-left'
                          : 'text-4xl'
                      } animate-pop`}
                    >
                      {source.first === i1 && source.second === i2
                        ? '💠'
                        : destination.first === i1 && destination.second === i2
                        ? '🚩'
                        : ''}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </>
        ) : (
          <div
            className="font-nerd text-6xl text-center flex flex-row items-center justify-center w-full text-white"
            style={{ height: '100vh' }}
          >
            Coming Soon!
          </div>
        )}
      </div>
    </>
  )
}

export default App
