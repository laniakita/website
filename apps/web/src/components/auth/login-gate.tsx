export default function LoginGate() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-black/50 backdrop-blur-lg fixed inset-0 z-50">
      <form className="p-10 border border-ctp-base rounded-xl bg-ctp-crust shadow-2xl">
        <div className="flex flex-row items-center relative">
          <input id="passkey" name="passkey" placeholder="dev_key" className="w-full py-4 px-4 placeholder:text-ctp-surface2 font-mono text-ctp-text rounded-lg border bg-ctp-mantle border-ctp-surface0" />
          <button type="submit" className="bg-ctp-blue/30 hover:border-ctp-sky hover:text-ctp-sky border border-ctp-blue hover:bg-ctp-sky/30 rounded-lg text-ctp-blue w-fit font-mono text-center px-4 py-2 absolute right-2">unlock</button>
        </div>
      </form>
    </div>
  );
}
