import { Inter } from 'next/font/google'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Badminton Court Calendar',
  description: 'Manage your badminton court bookings',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="flex justify-between items-center p-4 bg-white shadow-sm">
          <div className="flex space-x-4">
            <Button variant="outline">Lịch hẹn</Button>
            <Button variant="outline">Quản lý</Button>
          </div>
          <div className="flex items-center space-x-4">
            <div>Địa chỉ sân: 86 Trần Hưng Đạo</div>
            <div>Doanh thu: $1000</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">AdminBadminton</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  Đổi mật khẩu
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}