import { Universe } from '@/scripts/universe'

describe('NuxtLogo', () => {
  test('Create Universe', () => {
    const universe = Universe.getInstance()
    universe.createRandom()
    expect(universe.galaxies).toHaveLength(10)
    expect(universe.galaxies[0].solarSystems).toHaveLength(10)
    expect(universe.galaxies[0].solarSystems[0].planets).toHaveLength(10)
    expect(universe.galaxies[0].solarSystems[0].planets[0].cities).toHaveLength(
      10
    )
    expect(
      universe.galaxies[0].solarSystems[0].planets[0].stations
    ).toHaveLength(2)
    console.log(
      universe.galaxies[0].solarSystems[0].planets[0].cities[0].fullKey
    )
    console.log(
      universe.galaxies[0].solarSystems[0].planets[0].cities[0].fullName
    )

    const planet = universe.galaxies[0].solarSystems[0].planets[0]
    var map = planet.map
    expect(planet.cities[0].x).toBeGreaterThan(-1)
    expect(planet.cities[0].y).toBeGreaterThan(-1)

    //console.log(planet.cities[0])
  })
})
