// TODO: Add admin route protection based on Supabase user/role
// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(_req: NextRequest) {
  // 目前不拦截，直接放行
  return NextResponse.next();
}

// 仅匹配 /admin（避免对所有路由执行）
export const config = {
  matcher: ['/admin'],
};
