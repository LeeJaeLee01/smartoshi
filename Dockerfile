FROM rust:1.96-slim AS builder

WORKDIR /app
COPY Cargo.toml ./
COPY src ./src
COPY tests ./tests

RUN cargo build --release

FROM debian:bookworm-slim

WORKDIR /app
COPY --from=builder /app/target/release/smartoshi /usr/local/bin/smartoshi

EXPOSE 3000
CMD ["smartoshi"]
