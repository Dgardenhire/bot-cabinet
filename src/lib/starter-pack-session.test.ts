import { describe, expect, it, vi } from "vitest";
import { PACK_SESSION_TTL_MS, forgetPackSession, readPackSession, rememberPackSession } from "./starter-pack-session";
function store() {
 const values = new Map<string,string>();
 return {values,getItem:vi.fn((key:string)=>values.get(key)||null),setItem:vi.fn((key:string,value:string)=>{values.set(key,value);}),removeItem:vi.fn((key:string)=>{values.delete(key);})};
}
describe("tab-only starter pack access session",()=>{
 it("retains only an opaque token for a fixed interval without extending it on reads",()=>{
  const storage=store();const token="A".repeat(43);rememberPackSession(token,storage,1000);
  expect(readPackSession(storage,2000)?.token).toBe(token);expect(storage.setItem).toHaveBeenCalledOnce();
  expect(readPackSession(storage,1000+PACK_SESSION_TTL_MS)).toBeNull();expect(storage.values.size).toBe(0);
 });
 it("rejects malformed, expired and overlong sessions",()=>{
  const storage=store();for(const value of ['{bad',JSON.stringify({token:"invalid",expiresAt:10000}),JSON.stringify({token:"A".repeat(43),expiresAt:PACK_SESSION_TTL_MS*2})]){
   storage.values.set("bot-cabinet:starter-pack-access",value);expect(readPackSession(storage,1000)).toBeNull();expect(storage.values.size).toBe(0);
  }
 });
 it("forgets access and tolerates unavailable browser storage",()=>{
  const storage=store();rememberPackSession("A".repeat(43),storage);forgetPackSession(storage);expect(readPackSession(storage)).toBeNull();
  const blocked={getItem(){throw Error("blocked");},setItem(){throw Error("blocked");},removeItem(){throw Error("blocked");}};
  expect(()=>rememberPackSession("A".repeat(43),blocked)).not.toThrow();expect(readPackSession(blocked)).toBeNull();
 });
});
