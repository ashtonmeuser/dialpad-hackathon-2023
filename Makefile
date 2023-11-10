.PHONY: tinygo rust server

RUN?=as

tinygo:
	cd TinyGo && tinygo build -o ../Runner/tinygo.wasm -target wasi main.go

as:
	cd AssemblyScript && npm run build:all
	cp AssemblyScript/build/*.wasm Server/modules

rust:
	cd Rust && RUSTFLAGS="-C link-arg=-s" cargo build --release --target wasm32-wasi

server:
	cd Server && python server.py
