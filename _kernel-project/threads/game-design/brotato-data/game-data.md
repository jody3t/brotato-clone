# Brotato Game Data Reference

Comprehensive game data compiled from the Brotato Wiki (brotato.wiki.spellsandguns.com) and community resources. For building a faithful Brotato clone.

---

## Table of Contents

1. [Stats (All 17 Primary + Secondary)](#1-stats)
2. [Damage Formula](#2-damage-formula)
3. [Wave System](#3-wave-system)
4. [Enemy Types](#4-enemy-types)
5. [Weapon Types and Classes](#5-weapon-types-and-classes)
6. [Characters](#6-characters)
7. [Items](#7-items)
8. [XP / Leveling](#8-xp--leveling)
9. [Shop Mechanics](#9-shop-mechanics)
10. [Material Drops](#10-material-drops)
11. [Danger Levels](#11-danger-levels)

---

## 1. Stats

### Primary Stats (17)

| # | Stat | Description | Base | Formula / Notes | Cap |
|---|------|-------------|------|-----------------|-----|
| 1 | **Max HP** | Damage you can take before dying | 10 | Direct value. If negative, acts as if = 1 | None |
| 2 | **HP Regeneration** | Passive healing over time | 0 | First point = 0.20 HP/s, each further point = +0.089 HP/s. If negative, acts as 0 | None |
| 3 | **Life Steal** | % chance each attack heals 1 HP | 0% | Triggers max once per 0.1s (10 HP/s hard cap). Cannot reduce weapon life steal below 0% | None |
| 4 | **Damage** | All damage dealt +1% per point | 0% | Additive with other % damage. Does NOT affect Engineering structures. Min 1 damage per hit | None |
| 5 | **Melee Damage** | Flat bonus to melee weapon base damage | 0 | Added to weapon base before % multipliers | None |
| 6 | **Ranged Damage** | Flat bonus to ranged weapon base damage | 0 | Added to weapon base before % multipliers | None |
| 7 | **Elemental Damage** | Flat bonus to elemental weapon base damage | 0 | Added to weapon base before % multipliers | None |
| 8 | **Attack Speed** | % faster attacks | 0% | Diminishing returns. Hard cap at 12 attacks/second | 12 atk/s |
| 9 | **Crit Chance** | % increased chance to deal critical hit | 0% | Added to weapon base crit chance. Excess over 100% is wasted | 100% |
| 10 | **Engineering** | Increases power of structures (turrets, mines, gardens) | 0 | Structures deal minimum 1 damage regardless | None |
| 11 | **Range** | Max range of weapons increased by X | 0 | Melee weapons only get half the Range bonus. Melee range also slightly reduces attack speed. Minimum 25 range | None |
| 12 | **Armor** | Reduce incoming damage | 0 | See Armor Formula below. Each point = +6.66% effective durability | None |
| 13 | **Dodge** | % chance to completely avoid an attack | 0% | Character-specific caps. Default max 60%. Ghost = 90%, Cryptid = 70% | 60% (default) |
| 14 | **Speed** | Movement speed modifier | 0% | Stalls at -100% or more (you stop moving) | None |
| 15 | **Luck** | % more chance to find items/consumables from kills | 0 | Affects shop item rarity and level-up upgrade tier quality | None |
| 16 | **Harvesting** | Materials and XP earned at wave end | 0 | Increases by 5% every time it activates. Negative harvesting does not increment | None |
| 17 | **Curse** (DLC) | Chance to spawn cursed enemies | 0 | Cursed enemies: +25% Damage, +15% Speed, +150% HP. They drop 33% extra materials. Also 15% chance for enhanced shop items | 50% enemy chance |

### Secondary Stats

These are minor stats modified by items, characters, or weapon classes. They appear in the Secondary Stats tab.

| Stat | Description |
|------|-------------|
| **Consumable Heal** | Increases/decreases healing from consumable pickups |
| **% Materials Healing** | Chance to gain 1 HP when picking up materials (Cute Monkey exclusive) |
| **% XP Gain** | Multiplier on all experience earned |
| **% Pickup Range** | Range for auto-collecting materials and consumables |
| **% Items Price** | Modifier on shop item prices |
| **% Explosion Damage** | Increases/decreases explosion damage |
| **% Explosion Size** | Increases/decreases explosion radius |
| **Bounces** | Additional bounces for projectiles |
| **Piercing** | Additional enemies projectiles pass through |
| **% Piercing Damage** | Damage falloff on pierced targets |
| **% Damage against Bosses** | Multiplier on damage to bosses and elites |
| **% Structure Attack Speed** | Fire rate of turrets/gardens |
| **Structure Range** | Range of structures (Builder-exclusive) |
| **% Burning Speed** | Rate at which burn ticks |
| **Burning Spread** | Number of times burn spreads to nearby enemies |
| **Knockback** | Distance enemies are pushed when hit |
| **% Double Material Chance** | Odds of gaining double materials on pickup |
| **Free Rerolls** | Complimentary rerolls at shop start |
| **Trees** | Additional trees spawned per wave |
| **% Enemies** | Modifier on number of enemies spawned |
| **% Enemy Speed** | Modifier on enemy movement speed |
| **% Reroll Price** | Modifier on shop reroll costs |

---

## 2. Damage Formula

### Base Weapon Damage

```
Effective Base Damage = Weapon Base Damage + (Type Damage Stat)
```

Where Type Damage Stat is Melee Damage, Ranged Damage, or Elemental Damage depending on weapon type.

### Damage Multiplier

```
Final Damage = Effective Base Damage * (1 + % Damage / 100)
```

- `% Damage` and `% Explosion Damage` stack ADDITIVELY with each other
  - Example: +30% Damage + Dynamite (+15% Explosion Damage) = +45% for explosive weapons
- Minimum final damage = 1 per hit

### Critical Hits

```
Crit Chance = Weapon Base Crit % + Crit Chance Stat
```

| Weapon | Typical Base Crit | Typical Crit Multiplier |
|--------|-------------------|------------------------|
| Most weapons | 3% | x2.0 |
| Fist | 1% | x1.5 |
| Pistol | 5%/10%/15%/20% (by tier) | x2.0 |
| Knife | 5% | x4.0 |
| Sniper Gun | varies | x4.0 |
| Drill | varies | x2.5 |

- Crit chance caps at 100%
- Piercing and bouncing attacks can crit on each individual hit
- Negative crit chance stat subtracts from weapon base crit (minimum 0%)

### Armor Reduction Formula

**Positive Armor:**
```
Damage Received % = 1 / (1 + (Armor / 15))
```

| Armor | Damage Received | Effective HP Multiplier |
|-------|----------------|------------------------|
| 0 | 100% | 1.00x |
| 3 | 83% | 1.20x |
| 5 | 75% | 1.33x |
| 8 | 65% | 1.53x |
| 10 | 60% | 1.67x |
| 15 | 50% | 2.00x |
| 30 | 33% | 3.00x |
| 45 | 25% | 4.00x |

Key property: each point of armor is equally valuable in terms of effective HP. +1 armor always increases the damage it takes to kill you by 6.66% of your base HP.

**Negative Armor:**
```
Damage Received % = (15 - 2 * Armor) / (15 - Armor)
```

(Where Armor is a negative number, e.g., Armor = -5)

| Armor | Damage Received |
|-------|----------------|
| -5 | 125% |
| -10 | 140% |
| -15 | 150% |
| -30 | 167% |

Negative armor has strong diminishing returns (unlike positive armor which scales linearly in effective HP).

**Rounding:** Enemy damage rounds before armor is applied, then reduced damage rounds again.

---

## 3. Wave System

### Wave Duration

| Wave | Duration (seconds) |
|------|-------------------|
| 1 | 20 |
| 2 | 25 |
| 3 | 30 |
| 4 | 35 |
| 5 | 40 |
| 6 | 45 |
| 7 | 50 |
| 8 | 55 |
| 9-19 | 60 |
| 20 (Boss) | 90 |

Formula: `Duration = min(60, 20 + (wave - 1) * 5)` for waves 1-19. Wave 20 = 90s.

### Total Waves

20 waves in a standard run. After wave 20, Endless Mode begins (optional).

### Enemy Spawn Rules

- Maximum 100 enemies on screen simultaneously
- If a new enemy would exceed the cap, a random non-elite/non-boss enemy on the map dies WITHOUT dropping loot
- Some enemies spawn with random speed within a range (e.g., Baby Alien: 200-300 speed)

### Elite and Horde Waves

| Danger Level | Challenging Waves | Wave Numbers |
|--------------|-------------------|--------------|
| 0-1 | None | N/A |
| 2-3 | 1 wave | Wave 11 or 12 |
| 4-5 | 3 waves | Waves 11-12, 14-15, 17-18 |

- 40% chance = Horde Wave, 60% chance = Elite Wave
- The third challenging wave (waves 17-18) is always an Elite Wave
- Same elite cannot appear twice per run

**Elite Waves:** One elite spawns alongside regular enemies. Defeating the elite drops a Legendary Loot Crate + restores 100 HP.

**Horde Waves:** More enemies spawn than normal. Enemies drop 35% less materials during hordes, but total materials typically higher due to enemy volume.

### Boss Wave (Wave 20)

- Danger 0-4: One random boss spawns
- Danger 5: Two bosses spawn, each with -25% HP

### Player Reference Speed

Player base speed = 450 units. All enemy speeds are relative to this.

---

## 4. Enemy Types

All enemies start with base HP and gain +HP/wave for each wave after the first. Damage works the same way. Speed does NOT change with wave or danger level.

### Regular Enemies (Crash Zone / Base Game)

| Enemy | Base HP | +HP/Wave | Speed | Base Dmg | +Dmg/Wave | Behavior |
|-------|---------|----------|-------|----------|-----------|----------|
| Tree | 10 | 5 | 0 | 0 | 0 | Neutral. Drops fruit or crate on death |
| Baby Alien | 3 | 2.0 | 200-300 | 1 | 0.6 | Chases player, contact damage |
| Chaser | 1 | 1.0 | 380 | 1 | 0.6 | Chases in groups, contact damage |
| Spitter | 8 | 1.0 | 200 | 1 | 0.6 | Runs away if close, fires projectiles from distance |
| Charger | 4 | 2.5 | 400 | 1 | 0.85 | Charges with 2.5-3.5 second cooldown |
| Pursuer | 10 | 24.0 | 150-600 | 1 | 1.2 | Gets faster each second |
| Bruiser | 20 | 11.0 | 300 | 2 | 0.85 | Charges, contact damage |
| Buffer | 20 | 3.0 | 150 | 1 | 0.6 | Buffs nearby enemies: +150% HP, +25% Damage, +50% Speed |
| Fly | 15 | 4.0 | 325-375 | 1 | 0.85 | Fires projectiles when hit by player projectiles |
| Healer | 10 | 8.0 | 400 | 1 | 0.85 | Heals nearby enemies for 100 HP (+10 per wave) |
| Looter | 5 | 30 | 300-400 | 1 | 0.85 | Drops Loot Crate + 8 Materials on death |
| Helmet Alien | 8 | 4.0 | 225-275 | 1 | 1.0 | Chases player |
| Fin Alien | 12 | 2.0 | 400 | 1 | 1.0 | Chases player |
| Spawner | 10 | 1.0 | 120 | 1 | 0.85 | Spawns 3 Junkie Aliens on death |
| Junkie | 5 | 5.0 | 350 | 1 | 1.0 | Moves around player, fires projectiles near player |
| Horned Bruiser | 30 | 22.0 | 300 | 1 | 1.15 | Charges with cooldown |
| Horned Charger | 12 | 5.0 | 425 | 1 | 1.1 | Charges with cooldown |
| Slasher Egg | 5 | 3.0 | 0 | 1 | 0.60 | Stationary. Spawns Slasher after 5 seconds |
| Slasher | 50 | 25.0 | 250-300 | 1 | 1.15 | Slashes vertically from medium range |
| Tentacle | 100 | 20.0 | 175 | 1 | 1.0 | Attacks in V shape from medium range |
| Lamprey | 30 | 15.0 | 350 | 1 | 0.75 | Charges every 1.5 seconds, shoots projectiles |
| Gobbler | 5 | 30 | 300-400 | 1 | 0.85 | Targets materials on ground, grows when eating them |

### Elite Enemies (Danger 2+)

All elites have 1 base HP + 750 HP/wave scaling, and +1.5 damage/wave.

| Elite | Speed | Behavior | Mutations |
|-------|-------|----------|-----------|
| Rhino | 250 | Charges every 2 seconds | Mutation at 60% HP or 25 seconds |
| Butcher | 200 | Slashes 4 times | Mutations at 70% and 40% HP |
| Monk | 350 | Spawns 15 Slasher Eggs, then shoots projectiles | Progressive |
| Croc | 350 | Charges with projectile patterns | Progressive |
| Colossus | 300 | Spawns 50 moving projectiles every second | Progressive |
| Mantis | 250 | Slashes 6 times every 1.25 seconds | Progressive |
| Mother | 250 | Creates 4-pronged slash; spawns ~9 Fin Aliens per second | Progressive |
| Gargoyle | 350 | Spawns circles of projectiles every 0.3 seconds | Progressive |

### Bosses (Wave 20)

| Boss | HP | Speed | Contact Damage | Projectile Damage | Behavior |
|------|-----|-------|----------------|-------------------|----------|
| Predator | 29,250 | 300 | 30 | 23 | Surrounds itself in circling projectiles |
| Invoker | 29,250 | 200-500 | 30 | 23 | Creates area of projectiles every 2s around player |

### DLC Enemies (The Abyss)

#### Regular DLC Enemies

| Enemy | Base HP | +HP/Wave | Speed | Base Dmg | +Dmg/Wave | Behavior |
|-------|---------|----------|-------|----------|-----------|----------|
| Anemone | 8 | 4.0 | 100 | 1 | 0.85 | Creates circle of projectiles moving toward itself |
| Anglerfish | 10 | 10 | 200 | 1 | 1.1 | Charges up to 3 times before stopping |
| Blobfish | 10 | 8.0 | 200 | 1 | 0.6 | Spawns 4 Lampreys and Sea Pig on death |
| Clam | 2 | 3.0 | 130 | 1 | 0.6 | Fires slow projectiles toward player |
| Colossal Squid | 30 | 20.0 | 200 | 1 | 1.0 | Fires two crossing spikes toward player |
| Crab | 4 | 3.0 | 250 | 1 | 0.6 | Fires spike and moves backwards |
| Diplocaulus | 30 | 35.0 | 200 | 1 | 0.85 | Leaves slasher eggs every few seconds |
| Dragonfish | 100 | 50 | 300 | 1 | 1.15 | Shoots lines of bullets in player's direction |
| Goblin Shark | 12 | 10.0 | 275 | 1 | 1.1 | Charges toward player's movement direction |
| Hermit | 5 | 5.0 | 300 | 1 | 0.85 | Wanders and heals nearby enemies |
| Iron Lung | 5 | 4.0 | 0 | 1 | 0.25 | Stationary. Spawned by Stargazers; becomes Dragonfish after mutation |
| Lobster | 1 | 5.0 | 250 | 1 | 0.85 | Takes reduced damage from all sources |
| Looting Pig | 5 | 30.0 | 350 | 1 | 0.85 | Drops crate on death |
| Narwhal | 10 | 8.0 | 250 | 1 | 1.15 | Charges, firing spike in front |
| Plankton | 1 | 1.0 | 225 | 1 | 0.4 | Chases, sometimes charges |
| Pufferfish | 5 | 2.0 | 175 | 1 | 0.85 | Explodes into 10 projectiles on death |
| Sea Pig | 30 | 15.0 | 150 | 1 | 0.85 | Drops materials; gives 1 curse on death |
| Shrimp | 2 | 2.0 | 300 | 1 | 0.6 | Chases player |
| Stargazer | 30 | 15.0 | 100 | 1 | 0.85 | Moves toward Iron Lung; buffed if Iron Lung dies |
| Stonefish | 20 | 5.0 | 150 | 1 | 0.6 | Buffs enemies; spawns 6 projectiles every few seconds |
| Vampire Squid | 10 | 5.0 | 275 | 1 | 1.0 | Fires two projectiles in front |
| Viperfish | 1 | 3.0 | 80 | 1 | 0.65 | Grows after spawning, then chases player |
| Walrus | 40 | 25.0 | 200 | 1 | 1.2 | Charges toward player every few seconds |

#### DLC Elites

All DLC elites: 750 HP base + 750 HP/wave, +1.5 damage/wave.

Bat, Giant, Giant Isopod, Impaled Worm, Jellyfish, Megalodon, Prisoner, Spider Crab, Turtle -- each with unique mutation patterns.

#### DLC Bosses

| Boss | HP | Speed | Contact Damage | Projectile Damage | Behavior |
|------|-------|-------|----------------|-------------------|----------|
| Dead Whale | 31,625 | 200 | 30 | 23 | Fires 3 waves of 6 projectiles; charges with projectile circle |
| Eel | 31,625 | 150 | 30 | 23 | Fires projectile stream; spawns spiral projectiles around player |

### Enemy HP Formula

```
Enemy HP at Wave W = Base HP + (HP per Wave * (W - 1))
```

Example: Tree at Wave 10 = 10 + (5 * 9) = 55 HP

### Enemy Damage Formula

```
Enemy Damage at Wave W = Base Damage + (Damage per Wave * (W - 1))
```

---

## 5. Weapon Types and Classes

### Weapon Categories

**Melee Weapons (46 total):** Hit multiple enemies at once. Return to player after brief delay. Two attack types:
- **Thrust** -- straight line attack
- **Sweep** -- wide curve attack

**Ranged Weapons (30 total):** Fire projectiles. Typically single-target but gain Bounce and Piercing for multi-target.

### Tier / Rarity System

| Tier | Rarity | Color |
|------|--------|-------|
| 1 | Common | White |
| 2 | Uncommon | Blue |
| 3 | Rare | Purple |
| 4 | Legendary | Red |

**Merging:** Two identical weapons of the same tier combine into one weapon of the next tier.

### Weapon Capacity

Default: 6 weapon slots. Character exceptions:
- One Armed: 1 weapon
- Multitasker: 12 weapons
- Bull: 0 weapons (cannot equip)
- Baby: 1 slot, +1 per level up (max 24)

### Damage Scaling Types

Weapons scale with one primary stat:
- Melee Damage (most melee weapons)
- Ranged Damage (most ranged weapons)
- Elemental Damage (elemental weapons)
- Some weapons also scale with Engineering, Armor, Range, Attack Speed, or Level

### Range Interaction with Melee

Range stat affects melee weapons at HALF effectiveness and slightly reduces their attack speed.

### Projectile Rules

- Projectiles with both Pierce and Bounce: "only pierce after they've finished bouncing"
- Explosive ranged weapons: "explode for every bounce and pierce"

### Sample Weapon Stats

#### Fist (Melee, Unarmed class)

| Tier | Damage | Attack Speed | DPS | Crit | Range |
|------|--------|-------------|-----|------|-------|
| 1 | 8 (100% Melee) | 0.78s | 10.3/s | 1% x1.5 | 150 |
| 2 | 16 (100% Melee) | 0.73s | 21.9/s | 1% x1.5 | 150 |
| 3 | 32 (100% Melee) | 0.69s | 46.4/s | 1% x1.5 | 150 |
| 4 | 64 (100% Melee) | 0.59s | 108.5/s | 1% x1.5 | 150 |

#### Pistol (Ranged, Gun class)

| Tier | Damage | Attack Speed | DPS | Crit | Range |
|------|--------|-------------|-----|------|-------|
| 1 | 12 (100% Ranged) | 1.20s | 10.0/s | 5% x2.0 | 400 |
| 2 | 20 (100% Ranged) | 1.12s | 17.9/s | 10% x2.0 | 400 |
| 3 | 30 (100% Ranged) | 1.03s | 29.1/s | 15% x2.0 | 400 |
| 4 | 50 (100% Ranged) | 0.87s | 57.5/s | 20% x2.0 | 400 |

Special: Pierces 1 enemy dealing -50% to second target.

#### Sword (Melee, Blade + Medieval class)

| Tier | Damage | Attack Speed | DPS | Crit | Range |
|------|--------|-------------|-----|------|-------|
| 2 | 25 (100% Melee) | 1.28s | 19.5/s | 3% x2.0 | 200 |
| 3 | 40 (100% Melee) | 1.13s | 35.4/s | 3% x2.0 | 200 |
| 4 | 60 (100% Melee) | 0.98s | 61.2/s | 3% x2.0 | 200 |

Special: Alternates between thrust and sweep attacks.

### Complete Weapon List

**Melee (46):** Anchor, Brick, Cacti Club, Captain's Sword, Chainsaw, Chopper, Circular Saw, Claw, DEX-troyer, Drill, Excalibur, Fist, Flaming Brass Knuckles, Ghost Axe, Ghost Flint, Hammer, Hand, Hatchet, Hiking Pole, Jousting Lance, Knife, Lightning Shiv, Lute, Mace, Plank, Plasma Sledge, Power Fist, Pruner, Quarterstaff, Rock, Scissors, Screwdriver, Scythe, Sharp Tooth, Sickle, Spear, Spiky Shield, Spoon, Stick, Sword, Thief Dagger, Thunder Sword, Torch, Trident, War Hammer, Wrench.

**Ranged (30):** Blunderbuss, Chain Gun, Crossbow, Double Barrel Shotgun, Fireball, Flamethrower, Flute, Gatling Laser, Ghost Scepter, Grenade Launcher, Harpoon Gun, Icicle, Javelin, Laser Gun, Medical Gun, Minigun, Nuclear Launcher, Obliterator, Particle Accelerator, Pistol, Potato Thrower, Revolver, Rocket Launcher, Shredder, Shuriken, Slingshot, SMG, Sniper Gun, Taser, Wand.

### Notable Weapon Mechanics

| Weapon | Special Mechanic |
|--------|-----------------|
| Chainsaw | Health % damage (1-2% vs bosses/elites) |
| Drill | Material drop on crit kill; +10% attack speed stacking |
| Wrench | Spawns turrets (basic, incendiary, laser, or explosive) |
| Scythe | 3 damage/second to user; +3% damage when taking damage |
| Excalibur | 200% scaling, -3 armor per equipped weapon |
| Chain Gun | Fires 2x3 projectiles, extreme DPS potential |
| Fireball | Explosive elemental projectile with burning spread |
| Medical Gun | Heals player instead of dealing damage |

### Weapon Classes and Their Bonuses

Each class gives stacking bonuses for having 2-6 weapons of that class equipped.

| Class | Weapons | Bonus (2 / 3 / 4 / 5 / 6 weapons) |
|-------|---------|-------------------------------------|
| **Blade** | Chopper, Circular Saw, Sword, Vorpal Sword, Captain's Sword, Chainsaw, Thunder Sword, Excalibur | +1/+2/+3/+4/+5 Melee Damage, +1%/+2%/+3%/+4%/+5% Life Steal |
| **Blunt** | Brick, Rock, Spiky Shield, Spoon, Hammer, War Hammer | +1/+2/+3 Armor, +3/+4.5/+6 Max HP, -2%/-5%/-10% Speed |
| **Elemental** | Icicle, Lightning Shiv, Plank, Taser, Torch, Wand, Fireball, Flamethrower, Flaming Brass Knuckles, Particle Accelerator, Plasma Sledge, Thunder Sword | +1/+2/+3/+4/+5 Elemental Damage |
| **Ethereal** | Ghost Axe, Ghost Flint, Ghost Scepter, Scythe | +6%/+12%/+18%/+24%/+30% Dodge, -1/-2/-3/-4/-5 Armor |
| **Explosive** | Plank, Shredder, Fireball, Grenade Launcher, Rocket Launcher, Nuclear Launcher, Plasma Sledge, Power Fist, DEX-troyer | +5%/+10%/+15%/+20%/+25% Explosion Size |
| **Gun** | Double Barrel Shotgun, Laser Gun, Medical Gun, Pistol, Revolver, Shredder, SMG, Blunderbuss, Harpoon Gun, Minigun, Sniper Gun, Obliterator, Chain Gun | +10/+20/+30/+40/+50 Range |
| **Heavy** | Cacti Club, Anchor, Flamethrower, Grenade Launcher, Hammer, Mace, Rocket Launcher, Minigun, Nuclear Launcher, Obliterator, Particle Accelerator, War Hammer, Gatling Laser | +5%/+10%/+15%/+20%/+25% Damage |
| **Legendary** | Chain Gun, DEX-troyer, Drill, Excalibur, Gatling Laser, Scythe | -20/-40/-60/-80/-100 Max HP (penalty!) |
| **Medical** | Medical Gun, Scissors, Circular Saw | +1/+2/+3/+4/+5 HP Regeneration |
| **Medieval** | Crossbow, Jousting Lance, Quarterstaff, Spiky Shield, Mace, Sword, Trident, Vorpal Sword | +1/+2/+3 Armor, +0%/+3%/+6% Dodge |
| **Precise** | Claw, Crossbow, Icicle, Knife, Lightning Shiv, Scissors, Sharp Tooth, Shuriken, Thief Dagger, Sniper Gun, Drill | +3%/+6%/+9%/+12%/+15% Crit Chance |
| **Primitive** | Cacti Club, Hatchet, Javelin, Quarterstaff, Rock, Sharp Tooth, Slingshot, Spear, Stick, Torch | +3/+6/+9/+12/+15 Max HP |
| **Support** | Hand, Hiking Pole, Lute, Pruner, Sickle, Taser, Potato Thrower | +5/+10/+15/+20/+25 Harvesting |
| **Tool** | Screwdriver, Wrench, Chainsaw | +1/+2/+3/+4/+5 Engineering |
| **Unarmed** | Claw, Fist, Hand, Flaming Brass Knuckles, Power Fist | +3%/+6%/+9%/+12%/+15% Dodge |

---

## 6. Characters

62 total characters (44 base game + 18 DLC). Most start with 6 weapon slots and 10 Max HP unless stated otherwise.

### Default Characters (Unlocked from start)

| Character | Starting Stats/Bonuses | Restrictions/Penalties | Starts With |
|-----------|----------------------|----------------------|-------------|
| **Well Rounded** | +5 Max HP, +5% Speed, +8 Harvesting | None | -- |
| **Brawler** | +50% Attack Speed with Unarmed, +15% Dodge | -50 Range, -50 Ranged Damage | Fist |
| **Crazy** | +100 Range with Precise, +25% Attack Speed | -30% Dodge, -10 Engineering, -10 Ranged Damage | Knife |
| **Ranger** | +50 Range, +50% Ranged Damage modifications | Cannot equip melee, -25% Max HP modifications | Pistol |
| **Mage** | +25% Elemental Damage modifications | -100% Melee/Ranged modifications, -50% Engineering | Snake + Scared Sausage |

### Unlockable Characters

| Character | Unlock Condition | Key Bonuses | Key Penalties |
|-----------|-----------------|-------------|---------------|
| **Chunky** | Die once | +25% Max HP mods, +1% Damage per 3 Max HP, +3 HP from consumables | -100% Life Steal, -50% HP Regen/Dodge, -100% Speed |
| **Old** | Kill 300 enemies | -25% Enemy Speed, +10 Harvesting, -33% Map Size, -10% Enemies | -10% Speed |
| **Lucky** | Collect 300 materials | +100 Luck, +25% Luck mods, 75% damage random enemy on pickup | -60% Attack Speed, -50% XP Gain |
| **Mutant** | Kill 2000 enemies | -66% XP required | +50% Item Price |
| **Generalist** | Collect 2000 materials | +2 Melee per 1 Ranged, +1 Ranged per 2 Melee | Max 3 melee + 3 ranged |
| **Loud** | Kill 5000 enemies | +30% Damage, +50% Enemies | -3 Harvesting end of wave |
| **Multitasker** | Collect 5000 materials | +20% Damage, 12 weapon slots | -5% Damage per weapon |
| **Wildling** | Kill 10000 enemies | +30% Life Steal with Primitive | Cannot equip tier 3+ weapons |
| **Pacifist** | Collect 10000 materials | Gain 0.65 material/XP per living enemy | -100% Damage, -100 Engineering |
| **Gladiator** | Kill 20000 enemies | +20% Attack Speed per different weapon, +5 Melee | Cannot equip ranged, -40% Attack Speed, -30 Luck |
| **Saver** | Collect 20000 materials | +15 Harvesting, +1% Damage per 25 Materials | +50% Item/Weapon Price |
| **Sick** | Reach -5% HP Regen | +12 Max HP, +25% Life Steal, -1 HP/s damage | -100 HP Regen |
| **Farmer** | Reach +200 Harvesting | +20 Harvesting, +3% Harvesting per wave | -50% materials dropped |
| **Ghost** | Reach +60% Dodge | +10 Damage with Ethereal, +30% Dodge (cap 90%) | -100 Armor |
| **Speedy** | Reach +50% Speed | +30% Speed, +1 Melee per 2% Speed | -100 Armor standing still, -3 Armor |
| **Entrepreneur** | Hold 3000 Materials | -25% Item Price, +50% Harvesting mods, +25% recycling | -100% materials start waves, -50% Damage |
| **Engineer** | 5 turrets simultaneously | +10 Engineering, +25% Engineering mods, structures spawn close | -50% Damage |
| **Explorer** | Kill 50 trees | More tree spawns, +10% Speed, +50% pickup range, +33% Map | -50% enemy drops, +25% Enemies, -40% Damage |
| **Doctor** | Heal 200 HP one wave | +200% Attack Speed Medical, +5 HP Regen, +100% HP Regen mods | -100% Attack Speed, -50% Armor mods |
| **Hunter** | Reach +300 Range | +100 Range, +1% Damage per 10 Range, +25% Crit mods | -100% Harvesting mods, -33% Max HP mods |
| **Artificer** | Kill 15 enemies one explosion | +175% Explosion Damage, +4% Explosion Size per Elemental | -100% Damage, -50% Armor |
| **Arms Dealer** | Recycle 12 weapons | -95% Weapons Price, +30 Harvesting, shops guarantee weapon | Weapons destroyed entering shop |
| **Streamer** | Reach -20% Speed | +3% materials/s standing still (max +25), +40% Damage/Atk Spd moving | -50% materials dropped |
| **Cyborg** | 10 Ranged Dmg + 3 structures | +200% Ranged mods, converts Ranged to Engineering mid-wave | -75% Engineering, -100% Melee/Elemental |
| **Glutton** | Pick up 20 consumables | +50 Luck, consumables explode 10 damage on pickup | +25% Item Price, -25% XP Gain |
| **Jack** | Kill boss/elite <15 seconds | +125% damage vs bosses/elites, +200% materials dropped | -70% Enemies, +175% Enemy HP, +35% Enemy Dmg |
| **Lich** | Reach +100 Max HP | +10 HP Regen, +10% Life Steal, heal damages random enemy | -50% Damage modifications |
| **Apprentice** | Reach level 20 | +2 Melee/+1 Ranged/+1 Elemental/+1 Engineering per level-up | -2 Max HP per level-up |
| **Cryptid** | 10+ living trees end wave | +6 more trees, gain 12 mat/XP per living tree, +3 HP Regen per tree | -100% Life Steal, -100 Range, Dodge cap 70% |
| **Fisherman** | 2 Bait during run | +5 Max HP, +20 Harvesting, shops guarantee Bait, -100% Bait price | -50% enemy drops |
| **Golem** | Finish wave with 1 HP | +20 Max HP, +33% Max HP/Armor mods, +40% Atk Spd <50% HP | Cannot heal |
| **King** | 3 tier IV weapons | +50 Luck, +25% Damage/Atk Spd per tier IV weapon | -15% Damage/Atk Spd per tier I weapon |
| **Renegade** | 10 different tier I items | +2 projectiles, +1 pierce, +10% Damage per tier I item | Cannot equip melee, -400% Damage, -50% accuracy |
| **One Armed** | Win Danger 0 | +200% Attack Speed, +100% Damage modifications | 1 weapon slot only |
| **Bull** | Win Danger 1 | +20 Max HP, +15 HP Regen, +10 Armor, explodes 30 damage on hit | Cannot equip weapons |
| **Soldier** | Win Danger 2 | +50% Damage/Atk Spd standing still, +200% pickup range | Cannot attack while moving |
| **Masochist** | Win Danger 3 | +5% Damage when hit (stacks per wave), +10 Max HP, +20 HP Regen, +8 Armor | -100% Damage (base) |
| **Knight** | Win Danger 4 | +2 Melee per Armor, +3 Armor | Cannot equip ranged, tier 2+ only, -50% Atk Spd mods |
| **Demon** | Win Danger 5 | +50% Materials converted to Max HP (13:1), purchase items with Max HP | Unique economy |
| **Baby** | Level 10 before wave 6 | +12 Harvesting, -20% Item Price, +1 weapon slot per level (max 24) | Start with 1 slot, +130% XP required |
| **Vagabond** | 6 different weapons | Weapons contribute to other weapon bonuses | Cannot equip duplicates, -5 Armor, -50% Luck/Harvesting mods |
| **Technomage** | 10 Elemental + 3 structures | +5% Structure atk spd per Elemental, +2 Elemental per Structure | +75% XP required, -100% Melee/Ranged |
| **Vampire** | Reach +40% Life Steal | +2% Damage per 1% missing HP, +1% Life Steal per 3% missing HP | -25% Max HP mods, -60% Damage, -100 HP Regen |

### DLC Characters

| Character | Key Bonuses | Key Penalties |
|-----------|-------------|---------------|
| **Sailor** | +200% Naval weapon dmg vs cursed, +25 Curse | -25% Damage, tier II+ only, Dodge cap 20% |
| **Curious** | +2 loot aliens per wave, +2% XP per different item | -10% Damage per duplicate, +25% Enemy HP |
| **Builder** | 5 uncollected materials = +1% Structure atk spd, +50% Engineering mods | -75% Damage, -30% pickup range |
| **Captain** | +60% XP per free weapon slot, +100% level-up stats | +200% XP required, +2% Enemy HP/dmg per wave |
| **Creature** | Damage scales 35% Curse, +1 Curse per level | -10 Range end wave, -5% XP Gain end wave |
| **Chef** | +35 Luck, +200% non-elemental dmg vs burning, consumables explode burning | +100% Enemy HP, -75% Elemental mods |
| **Druid** | Enemies higher fruit drop, +33% Luck on fruit pickup | -100 HP Regen/Life Steal, -50% Engineering |
| **Dwarf** | +1 Engineering killing 6+ with direct hit, +1 Melee per 2 Engineering | Cannot equip ranged, -100% Attack Speed |
| **Gangster** | Steal 1 item per shop, stealing spawns elite | Elites strengthen on kill, +20% Item Price |
| **Diver** | +200% Crit Damage Precise, enemies take 300% damage 3s after ranged hit | -100 Ranged Damage, +250% Enemy HP |
| **Hiker** | Earn 5 materials per 10 steps, +1 Max HP per 80 steps | -5% Speed, -50% materials dropped |
| **Buccaneer** | Materials +100% value, pickup resets weapon cooldowns | -100% Attack Speed, -50% enemy drops |
| **Ogre** | Enemies taking 2x max HP explode 10 damage, +10 Melee | Cannot equip ranged, -50% Atk Spd |
| **Romantic** | Enemies <25% HP 5% charm chance 8s, +50 Range melee | -3% Damage per 5 Curse, -1 Armor per 5 Curse |

---

## 7. Items

237 total items (201 base + 36 DLC). Items have 4 tiers matching weapon rarity.

### Tier I Items (53 items)

| Item | Cost | Effects |
|------|------|---------|
| Alien Tongue | 25 | +30% pickup range |
| Alien Worm | 15 | +3 Max HP, +2 HP Regen, -1 HP from consumables |
| Baby Elephant | 25 | 25% chance deal 1 damage to random enemy on material pickup |
| Baby Gecko | 18 | +20% material attraction, +10 Range |
| Bag | 15 | +15 materials from crates, -1% Speed |
| Bat | 20 | +2% Life Steal, -2 Harvesting |
| Beanie | 20 | +4% Speed, -6 Range |
| Boiling Water | 30 | +2 Elemental Damage, -1 Max HP |
| Book | 8 | +1 Engineering |
| Boxing Glove | 15 | +3 Knockback |
| Broken Mouth | 25 | +5 Max HP, -1 HP Regen |
| Butterfly | 30 | +2% Life Steal, -1 Elemental Damage |
| Cake | 15 | +3 Max HP, -1% Damage |
| Charcoal | 20 | +1 Elemental Damage, +2 Melee Damage, -2 Harvesting |
| Claw Tree | 20 | +1 Melee Damage, +3% Crit Chance, -1 Max HP |
| Coffee | 15 | +10% Attack Speed, -2% Damage |
| Coupon | 15 | -5% Items Price |
| Cute Monkey | 25 | +8% chance heal 1 HP on material pickup, -1 Ranged Damage |
| Defective Steroids | 20 | +2 Max HP, +2 Melee Damage, -3% Attack Speed |
| Duct Tape | 25 | +1 Armor, +1 Engineering, -2 Max HP |
| Dynamite | 20 | +15% Explosion Damage |
| Fertilizer | 15 | +8 Harvesting, -1 Melee Damage |
| Gentle Alien | 30 | +2 Max HP, +5% Damage, +5% Enemies |
| Glasses | 25 | +20 Range |
| Goat Skull | 25 | +3 Melee Damage, -2% Crit Chance |
| Gummy Berserker | 25 | +5% Attack Speed, +15 Range, -1 Armor |
| Head Injury | 25 | +6% Damage, -8 Range |
| Hedgehog | 30 | +2 Melee Damage, +1 Ranged Damage, -1 HP Regen |
| Helmet | 25 | +1 Armor, -2% Speed |
| Injection | 20 | +7% Damage, -2 Max HP |
| Insanity | 20 | +6% Crit Chance, -3% Damage |
| Landmines | 15 | Spawns landmine every 12s (10 damage + Engineering scaling) |
| Lemonade | 15 | +1 HP from consumables |
| Lens | 20 | +1 Ranged Damage, -5 Range |
| Lost Duck | 25 | +10 Luck, -1 Elemental Damage |
| Lumberjack Shirt | 15 | Trees die in one hit |
| Mushroom | 25 | +3 HP Regen, -2 Luck |
| Mutation | 25 | +1 Ranged Damage, +1 Elemental Damage, -3% Speed |
| Peaceful Bee | 18 | +4% Dodge, +4 Harvesting, -1 Melee/-1 Ranged Damage |
| Pencil | 15 | +2 Engineering, -1% Attack Speed, -1% Crit Chance |
| Plant | 10 | +3 HP Regen, -1% Life Steal |
| Propeller Hat | 28 | +10 Luck, -2% Damage |
| Scar | 30 | +20% XP Gain, -8 Range |
| Scared Sausage | 25 | 25% chance 1x3 burning damage (Elemental scaling) |
| Sharp Bullet | 25 | Pierce 1 additional target, -20% Piercing Damage, -5% Damage |
| Snake | 25 | Burning spreads to 1 additional enemy, -1 Max HP |
| Terrified Onion | 15 | +4% Speed, -6 Luck |
| Toxic Sludge | 20 | +2 Elemental Damage, -2% Dodge |
| Tree | 15 | More trees spawn |
| Turret | 15 | Spawns turret (10 damage + 80% Engineering scaling) |
| Ugly Tooth | 25 | Remove 10% enemy speed (max 30%), -3% Speed |
| Weird Food | 20 | +2 HP from consumables, -2% Dodge |
| Weird Ghost | 12 | +3 Max HP, Start next wave with -50% HP |

### Tier II Items (46 items)

| Item | Cost | Effects |
|------|------|---------|
| Acid | 65 | +8 Max HP, -4% Dodge |
| Alien Eyes | 50 | Shoots 6 eyes every 3s (6 damage + 50% Max HP scaling) |
| Bait | 25 | +8% Damage, Special enemies next wave |
| Banner | 55 | +20 Range, +10% Attack Speed, -2% Life Steal |
| Black Belt | 50 | +25% XP Gain, +3 Melee Damage, -8 Luck |
| Blindfold | 45 | +5% Crit Chance, +5% Dodge, -15 Range |
| Blood Leech | 45 | +2% Life Steal, +2 HP Regen, -4 Harvesting |
| Campfire | 40 | +2 Elemental Damage, +2 HP Regen, -2% Speed |
| Cog | 35 | +4 Engineering, -4% Damage |
| Compass | 40 | +5% Speed, +3 Engineering, -3% Crit Chance |
| Cyberball | 35 | 25% chance deal 1 damage on enemy death (Luck-based) |
| Cyclops Worm | 45 | +12% Damage, -12 Range |
| Dangerous Bunny | 35 | +1 free shop reroll (limit 3 per run) |
| Energy Bracelet | 55 | +4% Crit Chance, +2 Elemental Damage, -2 Ranged Damage |
| Eyes Surgery | 60 | Burning activates 10% faster, -10 Range |
| Fuel Tank | 45 | +4 Elemental Damage, -1 Melee/-1 Ranged Damage |
| Gambling Token | 60 | +8% Dodge, -1 Armor |
| Garden | 50 | Spawns garden creating fruit every 15s |
| Incendiary Turret | 40 | Spawns turret (5x8 burning + 33% Engineering) |
| Leather Vest | 45 | +2 Armor, +6% Dodge, -3 Max HP |
| Little Frog | 50 | +20% pickup range, +10 Harvesting, -5% Dodge |
| Little Muscley Dude | 50 | +3 Melee Damage, +5 Max HP, -15 Range |
| Lure | 45 | +3 HP Regen, 2 additional loot aliens next wave |
| Mastery | 55 | +6 Melee Damage, -3 Ranged Damage |
| Medal | 55 | +3 Max HP, +3% Damage, +1 Armor, +3% Speed, -4% Crit Chance |
| Medical Turret | 40 | Spawns turret healing 3 HP (5% Engineering scaling) |
| Metal Detector | 40 | +5% double material value, +6 Luck, +2 Engineering, -5% Damage |
| Metal Plate | 40 | +2 Armor, -3% Damage |
| Missile | 45 | +10% Damage, -4% Attack Speed |
| Padding | 45 | +3 Max HP, +1 Max HP per 100 materials held, -5% Speed |
| Piggy Bank | 40 | +20% materials at wave start (stops after wave 20) |
| Pocket Factory | 75 | +2 Engineering, Killing tree spawns turret |
| Pumpkin | 40 | +15% Piercing Damage, -2% Damage |
| Recycling Machine | 35 | +35% materials from recycling |
| Riposte | 40 | +2 Melee Damage, 100% dodge counter (1 + 300% Melee Damage) |
| Ritual | 60 | +6% Damage, +2% Life Steal, -2 Engineering |
| Scope | 55 | +2 Ranged Damage, +25 Range, -7% Attack Speed |
| Shady Potion | 48 | +20 Luck, -2 HP Regen |
| Small Magazine | 60 | +2 Ranged Damage, +10% Attack Speed, -6% Damage |
| Snail | 40 | -5% Enemy Speed, -3% Speed |
| Spicy Sauce | 40 | +3 Max HP, 25% consumable explosion (10 + Max HP scaling) |
| Sunglasses | 50 | +10% Crit Chance, -1 Armor |
| Tentacle | 32 | +3% Crit Chance, +20% heal on crit kill |
| Wheelbarrow | 40 | +16 Harvesting, -1 Armor |
| Whetstone | 40 | +4% Life Steal, -3 Knockback |
| White Flag | 40 | +5 Harvesting, -5% Enemies |

### Tier III Items (47 items)

| Item | Cost | Effects |
|------|------|---------|
| Adrenaline | 60 | +5% Dodge, 50% chance heal 5 HP on dodge |
| Alien Baby | 80 | +15 Max HP, +8% Enemy Speed |
| Alien Magic | 85 | +8 Max HP, +3 HP Regen, -8 Luck |
| Alloy | 80 | +3 all damage types, +3 Engineering, +5% Crit, -6% Dodge |
| Baby with a Beard | 100 | Fire bullet from corpse (1 + Ranged scaling), -50 Range |
| Bandana | 75 | Pierce 1 additional target, -10% Damage |
| Barricade | 75 | +8 Armor while standing still, -5% Speed |
| Bean Teacher | 70 | +40% XP Gain, -2% Life Steal |
| Blood Donation | 50 | +40 Harvesting, -1 damage/second |
| Bowler Hat | 75 | +15 Luck, +18 Harvesting, -5% Attack Speed, -3% Crit |
| Candle | 65 | +4 Elemental Damage, +1 HP Regen, -10% Enemies, -5% Damage |
| Chameleon | 70 | +3% Dodge, +20% Dodge while still, -4% Damage |
| Clover | 65 | +20 Luck, +6% Dodge, -2% Life Steal |
| Community Support | 75 | +1% Attack Speed per living enemy, -2 Armor |
| Crown | 70 | Harvesting +8% at wave end |
| Fairy | 85 | +1 HP Regen per Tier I item, -2 per Tier IV item |
| Fin | 65 | +10% Speed, +3% Life Steal, -8 Luck |
| Glass Cannon | 75 | +25% Damage, -3 Armor |
| Handcuffs | 80 | +8 all damage, +8 Engineering, Max HP capped at 10 |
| Hunting Trophy | 55 | 33% chance gain 1 material on crit kill |
| Improved Tools | 70 | +10% Attack Speed, structures benefit |
| Laser Turret | 65 | Spawns turret (20 piercing + 125% Engineering scaling) |
| Lucky Charm | 75 | +30 Luck, -2 Melee, -1 Ranged Damage |
| Mouse | 55 | +5% Life Steal, +10% Enemies, -5 Harvesting |
| Peacock | 50 | +25% XP, +100% enemies next wave, +50% enemy damage next wave |
| Plastic Explosive | 60 | +25% Explosion Damage, +15% Explosion Size |
| Poisonous Tonic | 80 | +10% Attack Speed, +5% Crit, +15 Range, -2 HP Regen |
| Power Generator | 65 | +1% Damage per 1% Speed, -5% Damage |
| Rip and Tear | 65 | 20% enemy explosion on death (10 + 50% Melee), -12 Harvesting |
| Sad Tomato | 50 | +8 HP Regen, Start waves with -50% HP |
| Shackles | 80 | +8 HP Regen, +8 Engineering, +80 Range, Speed capped at 0 |
| Shmoop | 60 | +6 Max HP, +2 HP Regen, -2 Melee, -1 Ranged |
| Silver Bullet | 70 | +25% damage vs bosses/elites |
| Statue | 60 | +40% Attack Speed while standing still, -10% Speed |
| Stone Skin | 80 | +1 Max HP per 1 Armor, -2 Armor |
| Strange Book | 70 | +1 Engineering per 1 Elemental, -1 Melee, -1 Ranged |
| Tardigrade | 50 | Nullify 1 hit per wave |
| Toolbox | 55 | +6 Engineering, -8% Attack Speed |
| Tractor | 70 | +40 Harvesting, -8% Damage |
| Triangle of Power | 65 | +20% Damage, +1 Armor, -2% Damage on hit |
| Tyler | 75 | Spawns bot (10 piercing lightning + Engineering scaling) |
| Vigilante Ring | 92 | +3% Damage at wave end |
| Wandering Bot | 60 | Spawns bot that slows enemies |
| Warrior Helmet | 80 | +3 Armor, +5 Max HP, -5% Speed |
| Wheat | 85 | +4 Melee, +2 Ranged, +10 Harvesting, -2 Elemental |
| Wings | 85 | +10% Speed, +30 Range, -2 Elemental |
| Wisdom | 85 | +5% Damage every 5s (stacking), -20% Damage |

### Tier IV Items (31 items)

| Item | Cost | Effects |
|------|------|---------|
| Anvil | 120 | Random weapon upgrades tier entering shop; if none, +2 Armor (limit 1) |
| Big Arms | 105 | +12 Melee, +6 Ranged, -1 Armor, -5% Speed |
| Bloody Hand | 100 | +12% Life Steal, +2% Damage per 1% Life Steal, -1 damage/second |
| Cape | 110 | +5% Life Steal, +20% Dodge, -2 all damages |
| Diploma | 80 | +10 Engineering, +20% XP, -3 Max HP |
| Esty's Couch | 100 | +5 Max HP, +2 HP Regen per -1% Speed, -15% Speed |
| Exoskeleton | 90 | +5 Armor, +5% Crit, +5 Engineering, +5% Speed, -2 HP Regen, -2% Life Steal |
| Explosive Shells | 110 | +60% Explosion Damage, +15% Size, -15% Damage |
| Explosive Turret | 80 | Spawns turret (25 explosive + 150% Engineering scaling) |
| Extra Stomach | 100 | +1 Max HP per consumable at full health (max +10/wave) |
| Focus | 110 | +30% Damage, -3% Attack Speed per weapon equipped |
| Giant Belt | 100 | Crits deal 10% enemy max HP bonus damage (1% vs bosses) |
| Gnome | 100 | +10 Melee, +10 Elemental, -20 Range, -20% pickup range |
| Grind's Magical Leaf | 100 | +3 Max HP, +1 HP Regen, +1% Life Steal at wave end |
| Heavy Bullets | 100 | +5 Ranged, +10% Damage, +10 Range, -5% Attack Speed, -5% Crit |
| Jet Pack | 100 | +15% Speed, +10% Dodge, -5 Max HP, -1 Armor |
| Lucky Coin | 100 | +2 Luck per 1% Crit Chance, -2 Armor |
| Mammoth | 130 | +20 Melee, +5 HP Regen, -8% Damage, -3% Speed |
| Medikit | 95 | +10 HP Regen, +2 HP Regen every 5s, -10 Luck |
| Night Goggles | 90 | +15% Crit, +50 Range, -3 Max HP, -1 Armor |
| Octopus | 105 | +12 Max HP, +5 HP Regen, +3% Life Steal, -8% Crit |
| Panda | 100 | +12 Max HP, +25 Luck, -5% Damage |
| Potato | 95 | +3 Max HP, +2 HP Regen, +1% Life Steal, +5% Damage, +5% Attack Speed, +3% Speed, +3% Dodge, +1 Armor, +5 Luck |
| Regeneration Potion | 90 | HP Regen doubled below 50% health, +3 HP Regen |
| Retromation's Hoodie | 100 | +2% Attack Speed per 1% Dodge, -80 Range |
| Ricochet | 110 | Projectiles gain 1 bounce, -25% Damage |
| Robot Arm | 90 | +6 Armor, +6 Engineering, -2 HP Regen, -2% Life Steal |
| Sifd's Relic | 100 | +100% material attraction range |
| Spider | 120 | +12% Damage, +6% Attack Speed per weapon equipped, -3% Dodge, -5 Harvesting |
| Torture | 110 | +15 Max HP, Heal exactly 4 HP/second only (replaces normal regen) |
| Wolf Helmet | 90 | +10 Elemental, +20 Luck, -5 Engineering |

---

## 8. XP / Leveling

### XP Required Formula

```
XP to reach Level N = (N + 3)^2
```

| Level | XP Required | Cumulative XP |
|-------|-------------|---------------|
| 1 | 16 | 16 |
| 2 | 25 | 41 |
| 3 | 36 | 77 |
| 4 | 49 | 126 |
| 5 | 64 | 190 |
| 10 | 169 | 805 |
| 15 | 324 | 2,330 |
| 20 | 529 | 4,310 |
| 25 | 784 | 7,665 |
| 30 | 1,089 | 12,515 |
| 50 | 2,809 | 51,025 |

### XP Sources

- Primary: Green currency dropped by killed enemies (same pickups as materials)
- Harvesting grants equal XP and materials at wave end
- Modified by `% XP Gain` stat

### Level-Up Rewards

On each level-up:
- +1 Max HP (automatic)
- Choose 1 of 4 random stat upgrades (presented at end of wave)

### Upgrade Tier Values

| Stat | Tier I | Tier II | Tier III | Tier IV |
|------|--------|---------|----------|---------|
| Max HP | +3 | +6 | +9 | +12 |
| HP Regeneration | +2 | +3 | +4 | +5 |
| Life Steal | +1 | +2 | +3 | +4 |
| Damage | +5 | +8 | +12 | +16 |
| Melee Damage | +2 | +4 | +6 | +8 |
| Ranged Damage | +1 | +2 | +3 | +4 |
| Elemental Damage | +1 | +2 | +3 | +4 |
| Attack Speed | +5 | +10 | +15 | +20 |
| Crit Chance | +3 | +5 | +7 | +9 |
| Engineering | +2 | +3 | +4 | +5 |
| Range | +15 | +30 | +45 | +60 |
| Armor | +1 | +2 | +3 | +4 |
| Dodge | +3 | +6 | +9 | +12 |
| Speed | +3 | +6 | +9 | +12 |
| Luck | +5 | +10 | +15 | +20 |
| Harvesting | +5 | +8 | +10 | +12 |

### Guaranteed Upgrade Tiers

| Level | Guaranteed Tier |
|-------|----------------|
| 1 | Tier I (100%) |
| 5 | Tier II (100%) |
| 10, 15, 20 | Tier III (100%) |
| 25, 30, 35... (every 5th) | Tier IV (100%) |

For non-guaranteed levels, upgrade rarity is affected by level and Luck stat (same rarity distribution as shop items, but using level instead of wave).

### Character XP Modifiers

| Character | XP Modifier |
|-----------|-------------|
| Mutant | -66% XP required |
| Lucky | -50% XP Gain |
| Baby | +130% XP required |
| Captain | +200% XP required, +60% XP gain per free weapon slot |
| Technomage | +75% XP required |

---

## 9. Shop Mechanics

### Shop Slots

4 slots total per shop visit.

### Item vs Weapon Distribution

| Waves | Distribution |
|-------|-------------|
| 1-2 | Exactly 2 Weapons + 2 Items |
| 3-5 | Guaranteed 1 Weapon + 3 slots rolled normally |
| 6+ | No guarantees. Each slot: 65% Item / 35% Weapon |

### Weapon Selection Pool (when a weapon appears)

| Source | Probability |
|--------|------------|
| Same weapon (as already owned) | 20% |
| Same class (as already owned) | 15% |
| All weapons | 65% |

Waves 1-5 have extra class bonus: 15% (wave 1) down to 3% (wave 5).

### Pricing Formula

```
Final Price = floor((Base_Price + Wave + (Base_Price * 0.1 * Wave)) * Shop_Price_Modifier)
```

- Minimum item cost: 1 material
- Locked items keep their price between waves (bypass inflation)

### Reroll Costs

```
First Reroll Cost = floor(Wave * 0.75) + Reroll_Increase
Reroll_Increase = floor(Wave * 0.40)  (minimum 1)
```

Each subsequent reroll in the same shop costs +Reroll_Increase more.

| Wave | First Reroll | Cost Increase per Reroll |
|------|--------------|--------------------------|
| 1-5 | 1-5 | 1-2 |
| 6-10 | 6-11 | 2-4 |
| 11-15 | 12-17 | 4-6 |
| 16-20 | 18-23 | 6-8 |

### Free Rerolls

- Each Dangerous Bunny item grants 1 free reroll (max 3 per run)
- Buying all 4 items in the shop gives 1 free reroll

### Locking

- Free and unlimited
- Locked items keep their price between waves and through rerolls
- Locked unique items cannot appear in loot crates simultaneously

### Recycling

- Default return: 25% of item value
- Recycling Machine: +35% (total 60%)
- Entrepreneur bonus: +25% (total 85% max)

### Rarity Distribution by Luck

Rarity of items in shop is affected by wave number and Luck stat.

**At 0 Luck:**
- Early waves: ~100% Tier I
- Mid waves: Tier I drops toward 40%, Tier II peaks ~44%, Tier III ~25%
- Late waves: Tier IV appears up to ~8%

**At 50 Luck:**
- Tier II peaks ~45%, Tier III ~23.3%, Tier IV ~3.1%

**At 100 Luck:**
- Tier II peaks ~48%, Tier III ~23.6%, Tier IV ~4.1%

### Character-Specific Item Pools

When an item appears in shop or loot crate, there is a 5% chance it is drawn from a tagged item pool matching your character's weapon/item tags.

### Price Modifiers

- Coupon: -5% per copy (max 50% with 5)
- Entrepreneur: -25% Item Price
- Baby: -20% Item Price
- Saver: +50% Item/Weapon Price

---

## 10. Material Drops

### Drop Mechanics

- Materials are green objects dropped by enemies on kill
- Primary currency for the shop + XP source

### Drop Rate

```
Base drop chance = 100%
Starting Wave 5: drop chance = 100% - (1.5% * Wave)
Floor: 50% (never drops below 50%)
```

| Wave | Drop Chance |
|------|------------|
| 1-4 | 100% |
| 5 | 92.5% |
| 10 | 85% |
| 15 | 77.5% |
| 20 | 70% |
| 32+ | 50% (floor) |

### Horde Wave Modifier

During Horde Waves, enemies have a 0.65 multiplier on drop rate (35% reduction), stacking multiplicatively with wave decay.

### Map Limits

- Maximum 50 material pickups on the map at once
- If exceeded, new materials merge into existing green blobs (value added to existing)

### Bagged Materials

- Uncollected materials at wave end are stored in a "bag"
- One material is extracted from the bag each time new materials drop
- This prevents value loss from uncollected drops

### Pickup Range

- Base pickup range is a fixed radius around the player
- Modified by `% Pickup Range` secondary stat
- Items like Alien Tongue (+30%), Sifd's Relic (+100%) increase range
- Characters like Soldier (+200% pickup range), Explorer (+50%) modify it

### Harvesting

At wave end, gain materials and XP equal to your Harvesting stat.
- Harvesting increases by 5% each time it activates (compound)
- Negative harvesting LOSES materials/XP but does NOT get the 5% increment

### Special Material Sources

| Source | Mechanic |
|--------|----------|
| Looter/Looting Pig | Drops Loot Crate + 8 materials on death |
| Metal Detector | 5% chance to double material value |
| Brick item | 10-120 materials on hit |
| Piggy Bank | +20% materials at wave start |
| Pacifist | 0.65 materials per living/despawned enemy |
| Cryptid | 12 materials per tree at wave end |
| Hiker | 5 materials per 10 steps walked |
| Hunting Trophy | 33% chance 1 material on crit kill |

---

## 11. Danger Levels

6 difficulty levels (0-5). Unlocking characters requires winning at each danger level.

| Danger | Enemy HP/Damage Modifier | Elite/Horde Waves | Special | Unlocks |
|--------|--------------------------|-------------------|---------|---------|
| 0 | None | None | -- | One Armed |
| 1 | None | None | New enemy types appear | Bull |
| 2 | None | 1 wave (waves 11-12) | New enemy types appear | Soldier |
| 3 | +12% HP and Damage | 1 wave (waves 11-12) | New enemy types appear | Masochist |
| 4 | +26% HP and Damage | 3 waves (11-12, 14-15, 17-18) | New enemy types appear | Knight |
| 5 | +40% HP and Damage | 3 waves (11-12, 14-15, 17-18) | Two bosses at wave 20 (each -25% HP). New enemy types | Demon |

**Important:** Each danger level's modifier is the TOTAL, not additive. Danger 5 enemies have +40% HP, not 12%+26%+40%.

### Accessibility Sliders

Separate from Danger, the game has accessibility sliders:
- Hit Points: up to 200%
- Damage: up to 200%
- Speed: up to 150%

These multiply with Danger modifiers. Example: Danger 5 + 200% HP slider = 140% * 200% = 280% enemy HP.

### Endless Mode

After Wave 20, Endless Mode starts with escalating "Endless Factor":
- Enemy Max HP increases by 225% of Endless Factor
- Enemy Damage increases by 100% of Endless Factor
- Enemy Speed increases gradually
- I-frame duration decreases (divided by Endless Factor)

---

## Appendix: Quick Reference Formulas

```
-- Armor (positive) --
Damage Multiplier = 1 / (1 + Armor/15)

-- Armor (negative) --
Damage Multiplier = (15 - 2*Armor) / (15 - Armor)

-- XP to Level --
XP(N) = (N + 3)^2

-- Enemy HP --
HP(wave) = BaseHP + (HPperWave * (wave - 1))

-- Enemy Damage --
Dmg(wave) = BaseDmg + (DmgPerWave * (wave - 1))

-- Wave Duration --
Duration(wave) = min(60, 20 + (wave-1)*5)  [wave 20 = 90s]

-- Shop Price --
Price = floor((BasePrice + Wave + BasePrice*0.1*Wave) * PriceMod)

-- Reroll Cost --
FirstReroll = floor(Wave * 0.75) + floor(Wave * 0.40)
NthReroll = FirstReroll + (N-1) * floor(Wave * 0.40)

-- Material Drop Chance --
DropChance(wave) = max(50%, 100% - 1.5% * wave)  [applies wave 5+]

-- HP Regen --
HPperSec = 0.20 + 0.089 * (HPRegen - 1)  [for HPRegen >= 1]

-- Life Steal --
Chance = LifeSteal%  [heals 1 HP, max once per 0.1s = 10HP/s cap]
```

---

Sources: [Brotato Wiki (spellsandguns)](https://brotato.wiki.spellsandguns.com/), [Brotato Fandom Wiki](https://brotato.fandom.com/wiki/), [brotato-builds.com](https://brotato-builds.com/), [Steam Community Guides](https://steamcommunity.com/app/1942280/discussions/)
