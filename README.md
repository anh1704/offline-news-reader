# 📰 Offline News Reader

Ứng dụng đọc tin tức Việt Nam với khả năng hoạt động offline, được phát triển bằng React Native và Expo.

## ✨ Tính năng chính

### 🌐 Đọc tin tức từ các báo Việt Nam
- **VnExpress** - Báo điện tử hàng đầu Việt Nam
- **Tuổi Trẻ** - Báo thanh niên Việt Nam  
- **Thanh Niên** - Tin tức đa dạng và cập nhật

### 📱 Chế độ Offline
- Tự động lưu cache tin tức khi online
- Đọc tin đã lưu khi mất kết nối mạng
- Hiển thị trạng thái "Chế độ Offline" rõ ràng
- Tự động đồng bộ khi có kết nối trở lại

### 🏷️ Phân loại tin tức
- **Thời sự** - Tin chính trị, xã hội
- **Kinh tế** - Tài chính, thương mại, đầu tư
- **Thể thao** - Bóng đá, SEA Games, Olympic
- **Công nghệ** - AI, startup, đổi mới sáng tạo
- **Sức khỏe** - Y tế, dinh dương, làm đẹp
- **Giải trí** - Âm nhạc, điện ảnh, sao Việt
- **Thế giới** - Tin quốc tế, ngoại giao

### 🔄 Tương tác người dùng
- Pull-to-refresh để cập nhật tin mới
- Giao diện thân thiện, dễ sử dụng
- Hỗ trợ hình ảnh và định dạng rich text
- Chuyển đổi mượt mà giữa các chuyên mục

## 🛠️ Công nghệ sử dụng

### Framework & Runtime
- **React Native** với **Expo** - Phát triển đa nền tảng
- **TypeScript** - Đảm bảo type safety
- **Expo Router** - Điều hướng hiện đại

### Storage & Networking
- **AsyncStorage** - Lưu trữ dữ liệu cục bộ
- **NetInfo** - Phát hiện trạng thái kết nối
- **Fetch API** - Gọi API và RSS feeds

### UI/UX
- **React Native Components** - Giao diện native
- **StatusBar** - Quản lý thanh trạng thái
- **FlatList** - Hiển thị danh sách tối ưu

## 📁 Cấu trúc dự án

```
offline-news-reader/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Màn hình chính (danh sách tin)
│   │   ├── two.tsx              # Màn hình cài đặt
│   │   └── _layout.tsx          # Layout tab navigation
│   ├── article/                 # Dynamic routes
│   │   └── [id].tsx            # Chi tiết bài viết
│   └── _layout.tsx             # Root layout
├── services/                    # Business logic
│   └── NewsService.ts          # Service quản lý tin tức
├── assets/                     # Images, fonts, icons
├── components/                 # Reusable components
└── constants/                  # App constants
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- **Node.js** 18.0 trở lên
- **npm** hoặc **yarn**
- **Expo CLI** (tùy chọn)
- **iOS Simulator** (cho macOS) hoặc **Android Studio**

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd offline-news-reader
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Khởi động development server
```bash
npm start
```

### Bước 4: Chạy trên thiết bị/simulator

#### iOS Simulator
```bash
npm run ios
# hoặc nhấn 'i' trong terminal
```

#### Android Emulator  
```bash
npm run android
# hoặc nhấn 'a' trong terminal
```

#### Thiết bị thật
1. Tải **Expo Go** từ App Store/Google Play
2. Scan QR code hiển thị trong terminal
3. App sẽ tự động tải và chạy

## 📖 Hướng dẫn sử dụng

### Đọc tin tức
1. **Chọn nguồn tin** - Tap vào VnExpress, Tuổi Trẻ hoặc Thanh Niên
2. **Lọc chuyên mục** - Chọn danh mục tin quan tâm
3. **Đọc chi tiết** - Tap vào bài báo để xem nội dung đầy đủ
4. **Quay lại** - Sử dụng nút Back để trở về danh sách

### Chế độ offline
- App tự động lưu tin tức khi có mạng
- Khi mất mạng, hiển thị indicator "📱 Chế độ Offline"
- Tin đã lưu vẫn có thể đọc bình thường
- Pull-to-refresh sẽ báo "Không thể làm mới khi offline"

### Quản lý cache
1. Vào tab **Settings**
2. Xem **Cache Size** - Dung lượng đã sử dụng
3. **Clear Cache** - Xóa toàn bộ dữ liệu đã lưu
4. **Auto Refresh** - Bật/tắt tự động làm mới

## 🔧 Cấu hình

### RSS Feeds
App sử dụng RSS feeds từ các báo Việt Nam:
- **VnExpress**: vnexpress.net/rss
- **Tuổi Trẻ**: tuoitre.vn/rss  
- **Thanh Niên**: thanhnien.vn/rss

### Cache Management
- **Thời gian cache**: 5 phút
- **Dung lượng tối đa**: Không giới hạn
- **Tự động xóa**: Khi cache cũ hơn thời gian quy định

## 🌐 API & Services

### RSS2JSON
- **Service**: api.rss2json.com
- **Purpose**: Convert RSS feeds sang JSON
- **Fallback**: Multiple backup services

### NewsAPI (Backup)
- **Purpose**: Lấy tin từ newsapi.org
- **Usage**: Khi RSS services không khả dụng

### Mock Data
- **High-quality Vietnamese content**: Tin tức Việt Nam chất lượng cao
- **Fallback strategy**: Khi tất cả API fails
- **Categories**: Đầy đủ các chuyên mục

## 🔍 Troubleshooting

### App không lấy được tin tức mới
1. Kiểm tra kết nối internet
2. Pull-to-refresh để thử lại
3. Restart app nếu cần thiết

### iOS Simulator không khởi động
```bash
# Mở Simulator trước
open -a Simulator
# Sau đó chạy
npx expo start --ios
```

### Metro bundler error
```bash
# Clear cache và restart
npx expo start --clear
```

## 📱 Demo Giao diện

### Màn hình chính - Danh sách tin tức
<img src="/Users/ngocanh/Documents/Đa nền tảng/offline-news-reader/Simulator Screenshot - iPhone 15 Pro - 2025-10-06 at 19.29.43.png" alt="Màn hình chính" width="300"/>

*Giao diện danh sách tin tức với các tính năng:*
- Chọn nguồn tin (VnExpress, Tuổi Trẻ, Thanh Niên)
- Phân loại theo chuyên mục
- Hiển thị hình ảnh và tóm tắt
- Indicator trạng thái online/offline

### Chi tiết bài viết
<img src="/Users/ngocanh/Documents/Đa nền tảng/offline-news-reader/Simulator Screenshot - iPhone 15 Pro - 2025-10-06 at 19.33.49.png" alt="Chi tiết bài viết" width="300"/>

*Màn hình đọc chi tiết với:*
- Header với category badge
- Hình ảnh hero của bài viết
- Nội dung đầy đủ với typography đẹp
- Thông tin tác giả và ngày xuất bản
