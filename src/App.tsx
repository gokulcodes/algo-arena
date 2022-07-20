import { useState } from 'react'
import useSound from 'use-sound'

const BEEP = require('./assets/beep.mp3')
const FOUND = require('./assets/found.mp3')
interface tuple {
  first: number
  second: number
}

interface Lib {
  name: string
  theory: string
  key: string
  exec: Function
}

let ROW: number = 26
let COL: number = 60

const axisDefault: tuple = { first: -1, second: -1 }
// const clog = (data: any, cond: boolean) => (cond && console.log(data)) || cond
const graphDefault = new Array(ROW)
  .fill(false)
  .map(() => new Array(COL).fill(false))
const graphDefault2 = new Array(ROW)
  .fill(false)
  .map(() => new Array(COL).fill(false))

function Arena() {
  const [visited, setVisited] = useState<boolean[][]>(graphDefault)
  const [algo, setAlgo] = useState<string>('bfs')
  const [speed, setSpeed] = useState<number>(100)
  const [current, setCurrent] = useState<tuple>(axisDefault)
  const [source, setSouce] = useState<tuple>(axisDefault)
  const [destination, setDestination] = useState<tuple>(axisDefault)
  const [trigger, setTrigger] = useState<boolean>(false)
  const [finalPath, setFinalPath] = useState<boolean[][]>(graphDefault2)
  const [currentAudio, setCurrentAudio] = useState(BEEP)

  const [play] = useSound(currentAudio)

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const newTuple = (fst: number, snd: number): tuple => {
    return { first: fst, second: snd }
  }

  const axisDefaultCheck = (axis: tuple): boolean =>
    axis.first === -1 || axis.second === -1

  const axisAdd = (p1: tuple, p2: tuple): tuple =>
    newTuple(p1.first + p2.first, p1.second + p2.second)

  const axisEq = (p1: tuple, p2: tuple): boolean =>
    p1.first === p2.first && p1.second === p2.second

  const sourceDestinationCheck = (): boolean =>
    axisDefaultCheck(source) || axisDefaultCheck(destination)

  const reset = () => {
    setVisited(graphDefault)
    setSouce(axisDefault)
    setDestination(axisDefault)
    setTrigger(false)
  }

  const visitNode = (axis: tuple): boolean => {
    let x = axis.first
    let y = axis.second

    let cond = x < ROW && y < COL && x >= 0 && y >= 0
    let __visit = cond && visited[x][y]

    if (!__visit && cond) {
      let vis = visited
      vis[x][y] = true
      setVisited(vis)
      return true
    }
    return false
  }

  const BreathFirstSearch = async () => {
    const directions = [
      newTuple(0, 1),
      newTuple(1, 0),
      newTuple(0, -1),
      newTuple(-1, 0),
    ]

    let q: [tuple] = [source]
    setVisited(graphDefault)
    visitNode(source)

    while (true) {
      let top = q[0]
      q.shift()

      if (!top) return

      for (let dir of directions) {
        let now: tuple = axisAdd(top, dir)
        if (!visitNode(now)) continue

        setCurrent(now)
        play()
        q.push(now)
        await sleep(speed)

        if (axisEq(now, destination)) {
          setCurrentAudio(FOUND)
          finalVis()
          return
        }
      }
    }
  }

  const DepthFirstSearch = async () => {
    const directions = [
      newTuple(0, 1),
      newTuple(1, 0),
      newTuple(0, -1),
      newTuple(-1, 0),
    ]

    setVisited(graphDefault)
    visitNode(source)

    const core = async (node: tuple) => {
      await sleep(speed)

      if (axisEq(node, destination)) {
        setCurrentAudio(FOUND)
        finalVis()
        return
      }

      let now: tuple = newTuple(-1, -1)

      for (let dir of directions) {
        let curr: tuple = axisAdd(node, dir)
        if (
          curr.first < ROW &&
          curr.second < COL &&
          curr.first >= 0 &&
          curr.second >= 0
        ) {
          if (!visitNode(curr)) continue
          now = curr
          break
        }
      }

      play()
      setCurrent(now)
      core(now)
    }

    core(source)
  }

  const AlgoLib: { [index: string]: Lib } = {
    bfs: {
      name: 'Breadth First Search',
      theory:
        'Breadth First Search use a technique that visits the adjacent nodes of nodes to find the path. It is mainly used to find shortest distance between two points.',
      key: 'bfs',
      exec: () => BreathFirstSearch(),
    },
    dfs: {
      name: 'Depth First Search',
      theory:
        'Depth First Search use a technique of breaking the problem deeper and deeper and find the best possible result. It can be easily acheived with the help of Recursion! ',
      key: 'dfs',
      exec: () => DepthFirstSearch(),
    },
  }

  const finalVis = async () => {
    let rowDir = source.first <= destination.first ? 1 : -1,
      colDir = source.second <= destination.second ? 1 : -1
    let sr = source.first,
      dr = destination.first,
      sc = source.second,
      dc = destination.second

    while (sr !== dr) {
      let visual = finalPath
      setCurrent({ first: sr, second: source.second })
      visual[sr][source.second] = true
      setFinalPath(visual)
      sr += rowDir
      await sleep(speed)
    }

    while (sc !== dc + colDir) {
      let visual = finalPath
      setCurrent({ first: destination.first, second: sc })
      visual[destination.first][sc] = true
      setFinalPath(visual)
      sc += colDir
      await sleep(speed)
    }
    setTrigger(true)
    play()
  }

  return (
    <>
      <div className="flex flex-row w-full items-center p-4 justify-between h-14 text-white bg-gray-800 absolute z-50 top-0">
        <h1 className="text-white text-xl font-nerd font-bold">PathViz</h1>
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
            onClick={() =>
              // finalVis()
              AlgoLib[algo].exec()
            }
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
              <option className="font-nerd" value="1000">
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
                        : finalPath[i1][i2]
                        ? 'bg-green-600 border-[1px] border-gray-800 animate-opac'
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
                        destination.second === -1 &&
                        (source.first !== i1 || source.second !== i2)
                      ) {
                        setDestination({ first: i1, second: i2 })
                      }
                    }}
                  >
                    {trigger &&
                      destination.first === i1 &&
                      destination.second === i2 && (
                        <div className="absolute top-10 px-4 py-2 -right-12 animate-bounce w-32 bg-blue-600 rounded-lg text-white">
                          <p
                            className="font-nerd font-bold text-center"
                            style={{ fontSize: 12 }}
                          >
                            Path Found!
                          </p>
                        </div>
                      )}
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

export default Arena
