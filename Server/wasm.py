import json
from wasmtime import Store, Module, Instance, Func, Memory, Global, WasiConfig, Linker

def create_store():
    store = Store()
    config = WasiConfig()
    config.inherit_stderr()
    config.inherit_stdout()
    store.set_wasi(config)
    linker = Linker(store.engine)
    linker.define_wasi()
    return (store, linker)

(STORE, LINKER) = create_store()

class WasmModule:
    instance: Instance
    memory: Memory

    def __init__(self, file: str):
        """
        Instantiate module from Wasm binary
        Module must have exported memory
        """
        module = Module.from_file(STORE.engine, file)
        self.instance = LINKER.instantiate(STORE, module)
        self.memory = self._get_export('memory', Memory)

        try: # Attempt to run initialization function if available
            self.run("_start")
        except():
            pass

    def run(self, name: str, *args, **kwargs):
        """
        Run a function exported by the Wasm module
        """
        return self._get_export(name, Func)(STORE, *args, **kwargs)

    def get(self, name):
        """
        Get the value of a global exported by the Wasm module
        """
        return self._get_export(name, Global).value(STORE)

    def write(self, data, offset: int = 0):
        data = json.dumps(data, separators=(',', ':')).encode('utf-8')
        length = len(data)
        self.memory.write(STORE, length.to_bytes(4, 'little'), offset)
        self.memory.write(STORE, data, offset + 4)

    def _get_export(self, name: str, t: type):
        """
        Get an export of the Wasm module of the expected type
        """
        exports = self.instance.exports(STORE)
        if not name in exports:
            raise ValueError('Export not found')
        if not isinstance(exports[name], t):
          raise ValueError('Invalid export')
        return exports[name]
