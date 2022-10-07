//import AlienNames from 'alien-names'
const AlienNames = require('alien-names')
import Fakerator from 'fakerator'

class CoreObject {
  key: string = null!
  name: string = null!
  parent: CoreObject | null = null!

  get fullKey(): string {
    return this.parent ? this.parent.fullKey + '.' + this.key : this.key
  }
  get fullName(): string {
    return this.parent ? this.parent.fullName + '.' + this.name : this.name
  }
}

export class Universe {
  private static instance: Universe
  private constructor() {}
  static getInstance(): Universe {
    if (!Universe.instance) {
      Universe.instance = new Universe()
    }
    return Universe.instance
  }

  galaxies: Galaxy[] = []

  public createRandom() {
    const start = performance.now()
    for (let g = 0; g < 10; g++) {
      const galaxy = new Galaxy(`G${g}`, AlienNames.random(), null)
      this.galaxies.push(galaxy)
      for (let ss = 0; ss < 10; ss++) {
        const solarSystem = new SolarSystem(
          `SS${ss}`,
          Fakerator().address.country(),
          galaxy
        )
        galaxy.solarSystems.push(solarSystem)
        for (let p = 0; p < 10; p++) {
          const planet = new Planet(
            `P${p}`,
            Fakerator().address.country(),
            solarSystem,
            Math.floor(Math.random() * 40) + 5
          )
          solarSystem.planets.push(planet)
          // Populate the planet
          for (let c = 0; c < 10; c++) {
            const city = new City(`C${c}`, Fakerator().address.city(), planet)
            planet.cities.push(city)
          }
          for (let s = 0; s < 2; s++) {
            const station = new City(
              `S${s}`,
              Fakerator().address.city(),
              planet
            )
            planet.stations.push(station)
          }
        }
      }
    }
    console.log(`${performance.now() - start} ms`)
  }
}

class Galaxy extends CoreObject {
  constructor(
    public key: string,
    public name: string,
    public parent: CoreObject | null
  ) {
    super()
  }

  solarSystems: SolarSystem[] = []
}

class SolarSystem extends CoreObject {
  constructor(
    public key: string,
    public name: string,
    public parent: CoreObject
  ) {
    super()
  }
  planets: Planet[] = []
}

class Planet extends CoreObject {
  constructor(
    public key: string,
    public name: string,
    public parent: CoreObject,
    public size: number
  ) {
    super()
  }

  moons: Planet[] = []
  stations: City[] = []
  cities: City[] = []

  private myMap: Area | null = null
  get map(): Area {
    if (!this.myMap) {
      this.myMap = new Area(this.size, this.size)
      // Place cities
      this.cities.forEach((city) => {
        this.myMap!.placeItem(city)
      })
    }
    return this.myMap!
  }
}

interface Placeable {
  x: number | null
  y: number | null
}

class City extends CoreObject implements Placeable {
  constructor(
    public key: string,
    public name: string,
    public parent: CoreObject
  ) {
    super()
  }
  x: number | null = null
  y: number | null = null
}

class Artifact implements Placeable {
  x: number | null = null
  y: number | null = null
}

class Area {
  constructor(public width: number, public height: number) {
    for (let x = 0; x < width; x++) {
      const row: Tile[] = []
      this.tiles.push(row)
      for (let y = 0; y < height; y++) {
        const tile = new Tile(x, y)
        row.push(tile)
      }
    }
  }

  tiles: Tile[][] = []

  placeItem(item: Placeable) {
    do {
      item.x = Math.floor(Math.random() * this.width)
      item.y = Math.floor(Math.random() * this.height)
    } while (this.tiles[item.x][item.y].item)
    this.tiles[item.x][item.y].item = item
  }
}

class Tile {
  constructor(public x: number, public y: number) {}

  type: TileType = TileType.Land
  explored: boolean = false
  resources: Resource[] = []
  item: Placeable | null = null
}

enum TileType {
  Land,
  Water,
}

class Resource {
  constructor(public key: string, public name: string) {}

  quantity: number = 0
}
