# pontus-front

The source code for the p0ntus web frontend.

## Introduction

p0ntus is the successor to LibreCloud, with the same goals as the latter. p0ntus brings simplicity and structure, carrying on the values, structure, and rhythm that LibreCloud offered.

It's maintained solo, with occasional contributions from others. Because of this, I am severely limited by time. I am able to get to most requests and issues within the day. As it has become a controversial topic, I do use AI tools while programming. They help me so I still have time for other things in life.

Going into technical details, I built p0ntus with my most familiar stack. It consists of Next.js, Shadcn UI, Drizzle, Postgres, Better Auth, Altcha, and Docker. It is built to be visually simple, with easily extendable code. As always, this project is Unlicensed, meaning the code is available under public domain. I highly encourage modification and forks.

p0ntus will likely always be untested on Windows. I always encourage using Linux, but macOS works just fine too. Windows is spyware anyway, and you will have a much better experience both hosting and testing p0ntus under Linux.

## Enterprise Usage

I do encourage using p0ntus for commercial purposes. While the license doesn't hold you to it, I ask that you follow the same (or similar) values as the original project. They are open to interpretation, but hopefully your moral compass guides you.

If you are a company or organization in need of support or features, you can contact me at aidan[at]p0ntus[dot]com. All changes made, regardless of compensation, will be published publicly under the Unlicense. Support and feature requests are available to individuals and non-profits for free.

## Privacy

p0ntus is great for privacy! No data is collected, and many measures are taken to avoid proprietary software (and the tracking, logging, and invasive measures that come with them), while still providing a great experience to you.

CAPTCHAs are done with Altcha, which is a personal favorite of mine. It allows us to provide spam-free services, while still preserving your privacy. Proof of work is used instead, and no data is collected as a result.

p0ntus itself does not collect information in the background without your knowledge, and your account data is represented by what *you, yourself have entered*. We bring a connected experience with as little data collection as possible.

## Setup with Docker

I **highly** encourage the use of Docker for self-hosting p0ntus. It is the preferred deployment method for production use, and has the most testing. If you are planning to improve/modify the source code of p0ntus, please use the "Setup for Development" section. It will help you test more efficiently.

### What you need

- A server or computer
- `git` and [Bun](https://bun.sh)
- Docker and Docker Compose

### The Instructions

Let's dive in! First, clone the repo:

```bash
git clone https://git.p0ntus.com/pontus/pontus-front
```

For good measure, we'll install dependancies now:

```bash
bun install # or npm
```

Next, you should set your `.env`. You can copy and edit a good working example like so:

```bash
cp .env.example .env
vim .env # or nano
```

Once in the editor of your choice, edit `BETTER_AUTH_URL` with your domain name that you intend to deploy this to. Change the protocol if it applies. If you are developing p0ntus, you should leave this blank. `BETTER_AUTH_SECRET` should be set to a random value.

You don't need to change anything else for now. We'll come back to `.env` in a second. Save and exit in your editor, then run this command to generate and insert an `ALTCHA_SECRET` into your `.env`:

```bash
bun tools/hmac.ts
```

You can now copy the example Docker Compose file to the project root. You should change the password of the database, and additionally the username and database if you choose.

```bash
cp examples/docker-compose.yml docker-compose.yml
```

Then, reopen `.env` with your choice of editor and change the database URL to the format below. Replace the placeholders with the values you just set in `docker-compose.yml`. The host is `postgres`, unless you changed the name in `docker-compose.yml`, and the port is `5432`.

`postgres://<user>:<password>@<host>:<port>/<database>`

We will now bring up the database, push the schema, and seed services to the DB in one easy command. Let's go!

```bash
docker compose up postgres -d && bunx drizzle-kit push && bun tools/seed-db.ts
```

Assuming that completed correctly, you will now be ready to build and run the web interface. It's easy:

```bash
docker compose up -d
```

**You will now have everything working and ready!** You can find it at http://localhost:3000. This obviously isn't suitable for production use, so you should use a reverse proxy pointing to the `pontus-front` container. This will also allow for easy use of SSL. Reverse proxy is the most tested deployment method. I suggest NGINX Proxy Manager.

If you use a reverse proxy, don't forget to comment the ports section out like so:

```yaml
...
#ports:
#  - 3000:3000
...
```

## Setup for Development

### What you need

- A server or computer
- `git` and [Bun](https://bun.sh)
- Docker and Docker Compose

### The Instructions

Let's dive in! First, clone the repo:

```bash
git clone https://git.p0ntus.com/pontus/pontus-front
```

For good measure, we'll install dependancies now:

```bash
bun install # or npm
```

Next, you should set your `.env`. The only thing to change, for now, is setting `BETTER_AUTH_SECRET` to a random value. You can copy and edit a good working example like so:

```bash
cp .env.example .env
vim .env # or nano
```

We'll now generate and insert an `ALTCHA_SECRET` into the `.env` file with this:

```bash
bun tools/hmac.ts
```

You can now copy the example Docker Compose file to the project root. You should change the password of the database, and additionally the username and database if you choose.

```bash
cp examples/docker-compose.dev.yml docker-compose.yml
```

Then, reopen `.env` with your choice of editor and change the database URL to the format below. Replace the placeholders with the values you just set in `docker-compose.yml`. In a development environment, your host should be `localhost`, and the port `5432`. This is the default in `examples/docker-compose.dev.yml` as well.

`postgres://<user>:<password>@<host>:<port>/<database>`

We will now bring up the database, push the schema, and seed services to the DB in one easy command. Let's go!

```bash
docker compose up postgres -d && bunx drizzle-kit push && bun tools/seed-db.ts
```

Assuming that completed correctly, you will now be ready to build and test the web interface. With Postgres running in the background, you are free to develop easily. You can use `bunx drizzle-kit studio` to get a better view at the DB in a web interface.

Once you run the below command, the Next.js web interface will be brought up in a development environment. This makes it easier to see your changes, as they update live, in your browser, without restarting anything.

```bash
bun dev
```

At any time, you can also run `docker compose up -d --build` to test in Docker.

Now, open up http://localhost:3000 and see how it goes! Leave an Issue if you encounter any challenges or issues along the way.

## Updating

Updates are done through Forgejo (and mirrored GitHub). You can perform an update when there are new commits like so:

1. `git pull`
2. `bunx drizzle-kit push`
3. `bun tools/seed-db.ts`
4. `docker compose up -d --build`