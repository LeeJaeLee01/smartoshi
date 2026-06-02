# Frontend

Build React trước, Docker chỉ chạy file tĩnh.

```bash
npm install
REACT_APP_API_URL=http://127.0.0.1:3030 npm run build
npm start
```

Docker (từ thư mục gốc repo): xem `../README.md` — cần có `build/` trước khi `docker compose build`.
