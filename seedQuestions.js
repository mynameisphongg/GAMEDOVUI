const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quiz_game', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sampleQuestions = [
    // KIẾN THỨC CHUNG - EASY (20 câu)
    {
        question: "Thủ đô của Việt Nam là gì?",
        options: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"],
        answer: "Hà Nội",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Việt Nam nằm ở châu lục nào?",
        options: ["Châu Âu", "Châu Á", "Châu Phi", "Châu Mỹ"],
        answer: "Châu Á",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là đại dương lớn nhất thế giới?",
        options: ["Đại Tây Dương", "Ấn Độ Dương", "Bắc Băng Dương", "Thái Bình Dương"],
        answer: "Thái Bình Dương",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ngôn ngữ chính thức của Việt Nam là gì?",
        options: ["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp", "Tiếng Trung"],
        answer: "Tiếng Việt",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Quốc kỳ Việt Nam có màu gì?",
        options: ["Đỏ và vàng", "Đỏ và xanh", "Đỏ và trắng", "Đỏ và đen"],
        answer: "Đỏ và vàng",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị tiền tệ của Việt Nam?",
        options: ["Đô la", "Yên", "Đồng", "Bạt"],
        answer: "Đồng",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Thành phố nào đông dân nhất Việt Nam?",
        options: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"],
        answer: "Hồ Chí Minh",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là biển lớn nhất Việt Nam?",
        options: ["Biển Đông", "Biển Tây", "Biển Nam", "Biển Bắc"],
        answer: "Biển Đông",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu vùng miền?",
        options: ["2", "3", "4", "5"],
        answer: "3",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là ngọn núi cao nhất Việt Nam?",
        options: ["Fansipan", "Bà Đen", "Bạch Mã", "Ngũ Hành Sơn"],
        answer: "Fansipan",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Việt Nam có chung biên giới với bao nhiêu quốc gia?",
        options: ["2", "3", "4", "5"],
        answer: "3",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là sông dài nhất Việt Nam?",
        options: ["Sông Hồng", "Sông Mekong", "Sông Đồng Nai", "Sông Hương"],
        answer: "Sông Mekong",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu tỉnh thành?",
        options: ["61", "62", "63", "64"],
        answer: "63",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc hoa của Việt Nam?",
        options: ["Hoa sen", "Hoa mai", "Hoa đào", "Hoa hồng"],
        answer: "Hoa sen",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu dân tộc?",
        options: ["52", "53", "54", "55"],
        answer: "54",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là di sản văn hóa phi vật thể đầu tiên của Việt Nam được UNESCO công nhận?",
        options: ["Nhã nhạc cung đình Huế", "Quan họ Bắc Ninh", "Ca trù", "Hát xoan"],
        answer: "Nhã nhạc cung đình Huế",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu vịnh biển được UNESCO công nhận là di sản thiên nhiên thế giới?",
        options: ["1", "2", "3", "4"],
        answer: "1",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là thủ đô của Lào?",
        options: ["Phnom Penh", "Vientiane", "Bangkok", "Yangon"],
        answer: "Vientiane",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Việt Nam gia nhập ASEAN vào năm nào?",
        options: ["1993", "1994", "1995", "1996"],
        answer: "1995",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là thủ đô của Campuchia?",
        options: ["Phnom Penh", "Vientiane", "Bangkok", "Yangon"],
        answer: "Phnom Penh",
        category: "general",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },

    // KIẾN THỨC CHUNG - MEDIUM (20 câu)
    {
        question: "Quốc gia nào có diện tích lớn nhất thế giới?",
        options: ["Trung Quốc", "Hoa Kỳ", "Canada", "Nga"],
        answer: "Nga",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là ngôn ngữ phổ biến nhất thế giới?",
        options: ["Tiếng Anh", "Tiếng Trung", "Tiếng Tây Ban Nha", "Tiếng Hindi"],
        answer: "Tiếng Anh",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Quốc gia nào có nhiều múi giờ nhất?",
        options: ["Nga", "Hoa Kỳ", "Pháp", "Anh"],
        answer: "Pháp",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có dân số đông nhất thế giới?",
        options: ["Ấn Độ", "Trung Quốc", "Hoa Kỳ", "Indonesia"],
        answer: "Trung Quốc",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản văn hóa phi vật thể được UNESCO công nhận?",
        options: ["12", "13", "14", "15"],
        answer: "14",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có GDP cao nhất thế giới?",
        options: ["Trung Quốc", "Hoa Kỳ", "Nhật Bản", "Đức"],
        answer: "Hoa Kỳ",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản thiên nhiên thế giới?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có diện tích nhỏ nhất thế giới?",
        options: ["Monaco", "San Marino", "Vatican", "Liechtenstein"],
        answer: "Vatican",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản văn hóa vật thể được UNESCO công nhận?",
        options: ["7", "8", "9", "10"],
        answer: "8",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tuổi thọ trung bình cao nhất thế giới?",
        options: ["Nhật Bản", "Thụy Sĩ", "Singapore", "Hàn Quốc"],
        answer: "Nhật Bản",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu vườn quốc gia?",
        options: ["31", "32", "33", "34"],
        answer: "33",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có chỉ số phát triển con người (HDI) cao nhất thế giới?",
        options: ["Na Uy", "Thụy Sĩ", "Ireland", "Đức"],
        answer: "Na Uy",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu khu dự trữ sinh quyển thế giới?",
        options: ["8", "9", "10", "11"],
        answer: "9",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ biết chữ cao nhất thế giới?",
        options: ["Phần Lan", "Na Uy", "Andorra", "Liechtenstein"],
        answer: "Andorra",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu công viên địa chất toàn cầu?",
        options: ["2", "3", "4", "5"],
        answer: "3",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ tội phạm thấp nhất thế giới?",
        options: ["Iceland", "New Zealand", "Singapore", "Nhật Bản"],
        answer: "Iceland",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu khu Ramsar (vùng đất ngập nước có tầm quan trọng quốc tế)?",
        options: ["7", "8", "9", "10"],
        answer: "9",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ thất nghiệp thấp nhất thế giới?",
        options: ["Thái Lan", "Nhật Bản", "Singapore", "Qatar"],
        answer: "Qatar",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản văn hóa phi vật thể cần bảo vệ khẩn cấp?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ tái chế rác thải cao nhất thế giới?",
        options: ["Đức", "Hàn Quốc", "Áo", "Thụy Sĩ"],
        answer: "Đức",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu khu bảo tồn biển?",
        options: ["14", "15", "16", "17"],
        answer: "16",
        category: "general",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },

    // KIẾN THỨC CHUNG - HARD (20 câu)
    {
        question: "Đâu là quốc gia có tỷ lệ người dùng internet cao nhất thế giới?",
        options: ["Iceland", "Bermuda", "Liechtenstein", "Andorra"],
        answer: "Bermuda",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản văn hóa phi vật thể được UNESCO công nhận trong năm 2023?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ người dân hạnh phúc nhất thế giới theo Báo cáo Hạnh phúc Thế giới 2023?",
        options: ["Phần Lan", "Đan Mạch", "Iceland", "Israel"],
        answer: "Phần Lan",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam đứng thứ mấy trong bảng xếp hạng chỉ số đổi mới sáng tạo toàn cầu năm 2023?",
        options: ["45", "46", "47", "48"],
        answer: "46",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ phụ nữ trong quốc hội cao nhất thế giới?",
        options: ["Rwanda", "Cuba", "Bolivia", "Mexico"],
        answer: "Rwanda",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản văn hóa phi vật thể được UNESCO công nhận trong giai đoạn 2019-2023?",
        options: ["4", "5", "6", "7"],
        answer: "5",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ tái chế nhựa cao nhất thế giới?",
        options: ["Đức", "Hàn Quốc", "Áo", "Thụy Sĩ"],
        answer: "Đức",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam đứng thứ mấy trong bảng xếp hạng chỉ số cạnh tranh toàn cầu năm 2023?",
        options: ["67", "68", "69", "70"],
        answer: "68",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ người dân tham gia hiến máu cao nhất thế giới?",
        options: ["Áo", "Croatia", "Slovenia", "Slovakia"],
        answer: "Áo",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản văn hóa phi vật thể được UNESCO công nhận trong giai đoạn 2015-2019?",
        options: ["5", "6", "7", "8"],
        answer: "6",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ người dân sử dụng năng lượng tái tạo cao nhất thế giới?",
        options: ["Iceland", "Na Uy", "Thụy Điển", "Đan Mạch"],
        answer: "Iceland",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam đứng thứ mấy trong bảng xếp hạng chỉ số phát triển con người năm 2023?",
        options: ["114", "115", "116", "117"],
        answer: "115",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ người dân tham gia hoạt động tình nguyện cao nhất thế giới?",
        options: ["Myanmar", "Indonesia", "Hoa Kỳ", "New Zealand"],
        answer: "Myanmar",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản văn hóa phi vật thể được UNESCO công nhận trong giai đoạn 2010-2014?",
        options: ["3", "4", "5", "6"],
        answer: "4",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ người dân tham gia hoạt động thể thao cao nhất thế giới?",
        options: ["Phần Lan", "Thụy Điển", "Na Uy", "Đan Mạch"],
        answer: "Phần Lan",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam đứng thứ mấy trong bảng xếp hạng chỉ số minh bạch toàn cầu năm 2023?",
        options: ["85", "86", "87", "88"],
        answer: "87",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ người dân tham gia hoạt động văn hóa nghệ thuật cao nhất thế giới?",
        options: ["Pháp", "Ý", "Tây Ban Nha", "Bồ Đào Nha"],
        answer: "Pháp",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam có bao nhiêu di sản văn hóa phi vật thể được UNESCO công nhận trong giai đoạn 2005-2009?",
        options: ["2", "3", "4", "5"],
        answer: "3",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là quốc gia có tỷ lệ người dân tham gia hoạt động từ thiện cao nhất thế giới?",
        options: ["Myanmar", "Indonesia", "Hoa Kỳ", "Australia"],
        answer: "Myanmar",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Việt Nam đứng thứ mấy trong bảng xếp hạng chỉ số tự do kinh tế năm 2023?",
        options: ["105", "106", "107", "108"],
        answer: "107",
        category: "general",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },

    // KHOA HỌC - EASY (20 câu)
    {
        question: "Nước sôi ở nhiệt độ bao nhiêu độ C?",
        options: ["90°C", "95°C", "100°C", "105°C"],
        answer: "100°C",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'O'?",
        options: ["Oganesson", "Osmium", "Oxygen", "Osmium"],
        answer: "Oxygen",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh lớn nhất trong hệ Mặt Trời?",
        options: ["Sao Thổ", "Sao Mộc", "Sao Hỏa", "Sao Kim"],
        answer: "Sao Mộc",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu xương sườn?",
        options: ["10", "12", "14", "16"],
        answer: "12",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo nhiệt độ trong hệ SI?",
        options: ["Fahrenheit", "Celsius", "Kelvin", "Rankine"],
        answer: "Kelvin",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'H'?",
        options: ["Helium", "Hydrogen", "Hafnium", "Holmium"],
        answer: "Hydrogen",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là bộ phận lớn nhất trong cơ thể người?",
        options: ["Tim", "Gan", "Não", "Da"],
        answer: "Da",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo cường độ dòng điện?",
        options: ["Volt", "Ampe", "Watt", "Ohm"],
        answer: "Ampe",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Fe'?",
        options: ["Fermium", "Iron", "Fluorine", "Francium"],
        answer: "Iron",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh gần Mặt Trời nhất?",
        options: ["Sao Kim", "Sao Thủy", "Sao Hỏa", "Trái Đất"],
        answer: "Sao Thủy",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu răng vĩnh viễn?",
        options: ["28", "30", "32", "34"],
        answer: "32",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo khối lượng trong hệ SI?",
        options: ["Pound", "Kilogram", "Gram", "Ounce"],
        answer: "Kilogram",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Au'?",
        options: ["Silver", "Gold", "Copper", "Aluminum"],
        answer: "Gold",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là bộ phận lọc máu trong cơ thể người?",
        options: ["Tim", "Gan", "Thận", "Phổi"],
        answer: "Thận",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo điện áp?",
        options: ["Ampe", "Volt", "Watt", "Ohm"],
        answer: "Volt",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Ag'?",
        options: ["Gold", "Silver", "Aluminum", "Argon"],
        answer: "Silver",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh có vành đai nổi tiếng?",
        options: ["Sao Mộc", "Sao Thổ", "Sao Thiên Vương", "Sao Hải Vương"],
        answer: "Sao Thổ",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu xương trong cơ thể?",
        options: ["206", "208", "210", "212"],
        answer: "206",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo thời gian trong hệ SI?",
        options: ["Phút", "Giờ", "Giây", "Ngày"],
        answer: "Giây",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Cu'?",
        options: ["Carbon", "Copper", "Calcium", "Chlorine"],
        answer: "Copper",
        category: "science",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },

    // KHOA HỌC - MEDIUM (20 câu)
    {
        question: "Đâu là chất cứng nhất trong tự nhiên?",
        options: ["Vàng", "Sắt", "Kim cương", "Bạch kim"],
        answer: "Kim cương",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có số nguyên tử là 79?",
        options: ["Bạc", "Vàng", "Đồng", "Sắt"],
        answer: "Vàng",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là bộ phận sản xuất insulin trong cơ thể người?",
        options: ["Gan", "Tụy", "Thận", "Lách"],
        answer: "Tụy",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo công suất trong hệ SI?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        answer: "Watt",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Pb'?",
        options: ["Platinum", "Lead", "Phosphorus", "Polonium"],
        answer: "Lead",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh có nhiệt độ bề mặt cao nhất trong hệ Mặt Trời?",
        options: ["Sao Thủy", "Sao Kim", "Sao Hỏa", "Trái Đất"],
        answer: "Sao Kim",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu cơ trong cơ thể?",
        options: ["600", "650", "700", "750"],
        answer: "650",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo áp suất trong hệ SI?",
        options: ["Bar", "Pascal", "Atmosphere", "Torr"],
        answer: "Pascal",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Hg'?",
        options: ["Helium", "Hydrogen", "Mercury", "Magnesium"],
        answer: "Mercury",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là bộ phận sản xuất hồng cầu trong cơ thể người?",
        options: ["Gan", "Tủy xương", "Lách", "Thận"],
        answer: "Tủy xương",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo tần số trong hệ SI?",
        options: ["Hertz", "Decibel", "Watt", "Volt"],
        answer: "Hertz",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Sn'?",
        options: ["Silicon", "Tin", "Sulfur", "Selenium"],
        answer: "Tin",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh có nhiều vệ tinh nhất trong hệ Mặt Trời?",
        options: ["Sao Mộc", "Sao Thổ", "Sao Thiên Vương", "Sao Hải Vương"],
        answer: "Sao Thổ",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu cơ quan cảm giác chính?",
        options: ["3", "4", "5", "6"],
        answer: "5",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo năng lượng trong hệ SI?",
        options: ["Calorie", "Joule", "Watt", "Newton"],
        answer: "Joule",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'W'?",
        options: ["Tungsten", "Titanium", "Thallium", "Tellurium"],
        answer: "Tungsten",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là bộ phận sản xuất mật trong cơ thể người?",
        options: ["Gan", "Tụy", "Thận", "Lách"],
        answer: "Gan",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo điện trở trong hệ SI?",
        options: ["Volt", "Ampe", "Watt", "Ohm"],
        answer: "Ohm",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Pt'?",
        options: ["Platinum", "Lead", "Phosphorus", "Polonium"],
        answer: "Platinum",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh có nhiệt độ bề mặt thấp nhất trong hệ Mặt Trời?",
        options: ["Sao Thiên Vương", "Sao Hải Vương", "Sao Diêm Vương", "Sao Hỏa"],
        answer: "Sao Hải Vương",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu cơ quan nội tạng chính?",
        options: ["7", "8", "9", "10"],
        answer: "9",
        category: "science",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },

    // KHOA HỌC - HARD (20 câu)
    {
        question: "Đâu là nguyên tố có số nguyên tử cao nhất trong tự nhiên?",
        options: ["Uranium", "Plutonium", "Neptunium", "Americium"],
        answer: "Uranium",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là bộ phận sản xuất hormone tăng trưởng trong cơ thể người?",
        options: ["Tuyến yên", "Tuyến giáp", "Tuyến thượng thận", "Tuyến tụy"],
        answer: "Tuyến yên",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo từ thông trong hệ SI?",
        options: ["Tesla", "Weber", "Gauss", "Henry"],
        answer: "Weber",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Rn'?",
        options: ["Radon", "Radium", "Ruthenium", "Rhenium"],
        answer: "Radon",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh có tốc độ quay quanh trục nhanh nhất trong hệ Mặt Trời?",
        options: ["Sao Mộc", "Sao Thổ", "Sao Thiên Vương", "Sao Hải Vương"],
        answer: "Sao Mộc",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu cơ quan cảm thụ áp lực trong da?",
        options: ["150,000", "200,000", "250,000", "300,000"],
        answer: "250,000",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo độ phóng xạ trong hệ SI?",
        options: ["Becquerel", "Curie", "Gray", "Sievert"],
        answer: "Becquerel",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Es'?",
        options: ["Einsteinium", "Erbium", "Europium", "Einstenium"],
        answer: "Einsteinium",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là bộ phận sản xuất melatonin trong cơ thể người?",
        options: ["Tuyến tùng", "Tuyến yên", "Tuyến giáp", "Tuyến thượng thận"],
        answer: "Tuyến tùng",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo độ dẫn điện trong hệ SI?",
        options: ["Siemens", "Mho", "Ohm", "Volt"],
        answer: "Siemens",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Fm'?",
        options: ["Fermium", "Francium", "Fluorine", "Flerovium"],
        answer: "Fermium",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh có mật độ trung bình thấp nhất trong hệ Mặt Trời?",
        options: ["Sao Thổ", "Sao Thiên Vương", "Sao Hải Vương", "Sao Diêm Vương"],
        answer: "Sao Thổ",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu cơ quan thụ cảm nhiệt độ trong da?",
        options: ["150,000", "200,000", "250,000", "300,000"],
        answer: "200,000",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo độ phóng xạ hấp thụ trong hệ SI?",
        options: ["Becquerel", "Curie", "Gray", "Sievert"],
        answer: "Gray",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'Md'?",
        options: ["Mendelevium", "Manganese", "Magnesium", "Molybdenum"],
        answer: "Mendelevium",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là bộ phận sản xuất erythropoietin trong cơ thể người?",
        options: ["Gan", "Thận", "Tủy xương", "Lách"],
        answer: "Thận",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo độ phóng xạ tương đương trong hệ SI?",
        options: ["Becquerel", "Curie", "Gray", "Sievert"],
        answer: "Sievert",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Nguyên tố nào có ký hiệu hóa học là 'No'?",
        options: ["Nobelium", "Neon", "Neptunium", "Niobium"],
        answer: "Nobelium",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là hành tinh có tốc độ quay quanh Mặt Trời chậm nhất trong hệ Mặt Trời?",
        options: ["Sao Thiên Vương", "Sao Hải Vương", "Sao Diêm Vương", "Sao Hỏa"],
        answer: "Sao Hải Vương",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Con người có bao nhiêu cơ quan thụ cảm đau trong da?",
        options: ["3-4 triệu", "4-5 triệu", "5-6 triệu", "6-7 triệu"],
        answer: "3-4 triệu",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Đâu là đơn vị đo độ phóng xạ hoạt động trong hệ SI?",
        options: ["Becquerel", "Curie", "Gray", "Sievert"],
        answer: "Curie",
        category: "science",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },

    // LỊCH SỬ - EASY (20 câu)
    {
        question: "Ai là vị vua đầu tiên của nhà Nguyễn?",
        options: ["Gia Long", "Minh Mạng", "Thiệu Trị", "Tự Đức"],
        answer: "Gia Long",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?",
        options: ["1953", "1954", "1955", "1956"],
        answer: "1954",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn?",
        options: ["Lê Lợi", "Nguyễn Huệ", "Trần Hưng Đạo", "Quang Trung"],
        answer: "Lê Lợi",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Lý là gì?",
        options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Huế"],
        answer: "Thăng Long",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Trần?",
        options: ["Trần Thái Tông", "Trần Thủ Độ", "Trần Cảnh", "Trần Thừa"],
        answer: "Trần Thủ Độ",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Bạch Đằng lần thứ nhất diễn ra vào năm nào?",
        options: ["938", "939", "940", "941"],
        answer: "938",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Tây Sơn?",
        options: ["Nguyễn Nhạc", "Nguyễn Huệ", "Nguyễn Lữ", "Quang Trung"],
        answer: "Nguyễn Nhạc",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Nguyễn là gì?",
        options: ["Thăng Long", "Phú Xuân", "Huế", "Gia Định"],
        answer: "Huế",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là vị vua cuối cùng của nhà Nguyễn?",
        options: ["Thành Thái", "Duy Tân", "Khải Định", "Bảo Đại"],
        answer: "Bảo Đại",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Ngọc Hồi - Đống Đa diễn ra vào năm nào?",
        options: ["1788", "1789", "1790", "1791"],
        answer: "1789",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Hai Bà Trưng?",
        options: ["Trưng Trắc", "Trưng Nhị", "Hai Bà Trưng", "Bà Triệu"],
        answer: "Hai Bà Trưng",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Trần là gì?",
        options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Huế"],
        answer: "Thăng Long",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Lý?",
        options: ["Lý Thái Tổ", "Lý Thái Tông", "Lý Thánh Tông", "Lý Nhân Tông"],
        answer: "Lý Thái Tổ",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Bạch Đằng lần thứ hai diễn ra vào năm nào?",
        options: ["981", "982", "983", "984"],
        answer: "981",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Lý Bí?",
        options: ["Lý Bí", "Lý Phật Tử", "Lý Nam Đế", "Lý Phật Tử"],
        answer: "Lý Bí",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Đinh là gì?",
        options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Huế"],
        answer: "Hoa Lư",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là vị vua đầu tiên của nhà Lý?",
        options: ["Lý Thái Tổ", "Lý Thái Tông", "Lý Thánh Tông", "Lý Nhân Tông"],
        answer: "Lý Thái Tổ",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Bạch Đằng lần thứ ba diễn ra vào năm nào?",
        options: ["1287", "1288", "1289", "1290"],
        answer: "1288",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Mai Thúc Loan?",
        options: ["Mai Thúc Loan", "Mai Hắc Đế", "Mai Thúc Loan", "Mai Hắc Đế"],
        answer: "Mai Thúc Loan",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Lê là gì?",
        options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Huế"],
        answer: "Thăng Long",
        category: "history",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },

    // LỊCH SỬ - MEDIUM (20 câu)
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Yên Thế?",
        options: ["Hoàng Hoa Thám", "Đề Thám", "Hoàng Hoa Thám", "Đề Thám"],
        answer: "Hoàng Hoa Thám",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Rạch Gầm - Xoài Mút diễn ra vào năm nào?",
        options: ["1784", "1785", "1786", "1787"],
        answer: "1785",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Ba Đình?",
        options: ["Phạm Bành", "Đinh Công Tráng", "Phạm Bành", "Đinh Công Tráng"],
        answer: "Phạm Bành",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Mạc là gì?",
        options: ["Thăng Long", "Cao Bằng", "Phú Xuân", "Huế"],
        answer: "Cao Bằng",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Mạc?",
        options: ["Mạc Đăng Dung", "Mạc Đăng Doanh", "Mạc Đăng Dung", "Mạc Đăng Doanh"],
        answer: "Mạc Đăng Dung",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Chi Lăng diễn ra vào năm nào?",
        options: ["1426", "1427", "1428", "1429"],
        answer: "1427",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Bãi Sậy?",
        options: ["Nguyễn Thiện Thuật", "Nguyễn Thiện Thuật", "Nguyễn Thiện Thuật", "Nguyễn Thiện Thuật"],
        answer: "Nguyễn Thiện Thuật",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Hồ là gì?",
        options: ["Thăng Long", "Tây Đô", "Phú Xuân", "Huế"],
        answer: "Tây Đô",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Hồ?",
        options: ["Hồ Quý Ly", "Hồ Hán Thương", "Hồ Quý Ly", "Hồ Hán Thương"],
        answer: "Hồ Quý Ly",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Tốt Động - Chúc Động diễn ra vào năm nào?",
        options: ["1426", "1427", "1428", "1429"],
        answer: "1426",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Hương Khê?",
        options: ["Phan Đình Phùng", "Phan Đình Phùng", "Phan Đình Phùng", "Phan Đình Phùng"],
        answer: "Phan Đình Phùng",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Tây Sơn là gì?",
        options: ["Thăng Long", "Phú Xuân", "Huế", "Gia Định"],
        answer: "Phú Xuân",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Tây Sơn?",
        options: ["Nguyễn Nhạc", "Nguyễn Huệ", "Nguyễn Lữ", "Quang Trung"],
        answer: "Nguyễn Nhạc",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Đống Đa diễn ra vào năm nào?",
        options: ["1788", "1789", "1790", "1791"],
        answer: "1789",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Yên Bái?",
        options: ["Nguyễn Thái Học", "Nguyễn Thái Học", "Nguyễn Thái Học", "Nguyễn Thái Học"],
        answer: "Nguyễn Thái Học",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Lê sơ là gì?",
        options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Huế"],
        answer: "Thăng Long",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Lê sơ?",
        options: ["Lê Thái Tổ", "Lê Thái Tông", "Lê Thánh Tông", "Lê Nhân Tông"],
        answer: "Lê Thái Tổ",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Ngọc Hồi diễn ra vào năm nào?",
        options: ["1788", "1789", "1790", "1791"],
        answer: "1789",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Xô Viết Nghệ Tĩnh?",
        options: ["Nguyễn Ái Quốc", "Hồ Chí Minh", "Nguyễn Ái Quốc", "Hồ Chí Minh"],
        answer: "Nguyễn Ái Quốc",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Lê trung hưng là gì?",
        options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Huế"],
        answer: "Thăng Long",
        category: "history",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },

    // LỊCH SỬ - HARD (20 câu)
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Cần Vương?",
        options: ["Tôn Thất Thuyết", "Phan Đình Phùng", "Nguyễn Thiện Thuật", "Hoàng Hoa Thám"],
        answer: "Tôn Thất Thuyết",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Đống Đa lần thứ hai diễn ra vào năm nào?",
        options: ["1789", "1790", "1791", "1792"],
        answer: "1790",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Bắc Sơn?",
        options: ["Hoàng Văn Thụ", "Lương Văn Tri", "Hoàng Văn Thụ", "Lương Văn Tri"],
        answer: "Hoàng Văn Thụ",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Lê mạt là gì?",
        options: ["Thăng Long", "Cao Bằng", "Phú Xuân", "Huế"],
        answer: "Thăng Long",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Lê mạt?",
        options: ["Lê Duy Mật", "Lê Duy Kỳ", "Lê Duy Mật", "Lê Duy Kỳ"],
        answer: "Lê Duy Mật",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Đống Đa lần thứ ba diễn ra vào năm nào?",
        options: ["1791", "1792", "1793", "1794"],
        answer: "1792",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Nam Kỳ?",
        options: ["Nguyễn Văn Cừ", "Nguyễn Văn Cừ", "Nguyễn Văn Cừ", "Nguyễn Văn Cừ"],
        answer: "Nguyễn Văn Cừ",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Tây Sơn mạt là gì?",
        options: ["Thăng Long", "Phú Xuân", "Huế", "Gia Định"],
        answer: "Phú Xuân",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Tây Sơn mạt?",
        options: ["Nguyễn Quang Toản", "Nguyễn Quang Toản", "Nguyễn Quang Toản", "Nguyễn Quang Toản"],
        answer: "Nguyễn Quang Toản",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Đống Đa lần thứ tư diễn ra vào năm nào?",
        options: ["1792", "1793", "1794", "1795"],
        answer: "1793",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Thái Nguyên?",
        options: ["Trịnh Văn Cấn", "Lương Ngọc Quyến", "Trịnh Văn Cấn", "Lương Ngọc Quyến"],
        answer: "Trịnh Văn Cấn",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Nguyễn mạt là gì?",
        options: ["Thăng Long", "Phú Xuân", "Huế", "Gia Định"],
        answer: "Huế",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Nguyễn mạt?",
        options: ["Nguyễn Phúc Ánh", "Gia Long", "Nguyễn Phúc Ánh", "Gia Long"],
        answer: "Nguyễn Phúc Ánh",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Đống Đa lần thứ năm diễn ra vào năm nào?",
        options: ["1793", "1794", "1795", "1796"],
        answer: "1794",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Bắc Kỳ?",
        options: ["Nguyễn Thái Học", "Nguyễn Thái Học", "Nguyễn Thái Học", "Nguyễn Thái Học"],
        answer: "Nguyễn Thái Học",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Lê sơ mạt là gì?",
        options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Huế"],
        answer: "Thăng Long",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Lê sơ mạt?",
        options: ["Lê Uy Mục", "Lê Tương Dực", "Lê Uy Mục", "Lê Tương Dực"],
        answer: "Lê Uy Mục",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Chiến thắng Đống Đa lần thứ sáu diễn ra vào năm nào?",
        options: ["1794", "1795", "1796", "1797"],
        answer: "1795",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người lãnh đạo cuộc khởi nghĩa Trung Kỳ?",
        options: ["Phan Bội Châu", "Phan Châu Trinh", "Phan Bội Châu", "Phan Châu Trinh"],
        answer: "Phan Bội Châu",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Thủ đô của Việt Nam thời nhà Lê trung hưng mạt là gì?",
        options: ["Hoa Lư", "Thăng Long", "Phú Xuân", "Huế"],
        answer: "Thăng Long",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra nhà Lê trung hưng mạt?",
        options: ["Lê Duy Mật", "Lê Duy Kỳ", "Lê Duy Mật", "Lê Duy Kỳ"],
        answer: "Lê Duy Mật",
        category: "history",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },

    // THỂ THAO - EASY (20 câu)
    {
        question: "Môn thể thao nào được gọi là 'môn thể thao vua'?",
        options: ["Bóng đá", "Bóng rổ", "Tennis", "Bóng chuyền"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đội tuyển bóng đá Việt Nam đã vô địch AFF Cup bao nhiêu lần?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 5 vòng tròn trong biểu tượng Olympic?",
        options: ["Bóng đá", "Bóng rổ", "Tennis", "Tất cả các môn"],
        answer: "Tất cả các môn",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào được mệnh danh là 'Vua bóng đá'?",
        options: ["Maradona", "Pele", "Messi", "Ronaldo"],
        answer: "Pele",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 3 hiệp trong một trận đấu?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng chuyền",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đội tuyển bóng đá nào vô địch World Cup 2022?",
        options: ["Brazil", "Argentina", "Pháp", "Bồ Đào Nha"],
        answer: "Argentina",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 4 Grand Slam trong một năm?",
        options: ["Bóng đá", "Bóng rổ", "Tennis", "Golf"],
        answer: "Tennis",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào có biệt danh 'El Pibe'?",
        options: ["Carlos Valderrama", "James Rodriguez", "Radamel Falcao", "Juan Cuadrado"],
        answer: "Carlos Valderrama",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 5 vị trí chính trong một đội?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng rổ",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đội tuyển bóng đá nào vô địch World Cup 2018?",
        options: ["Brazil", "Argentina", "Pháp", "Đức"],
        answer: "Pháp",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 3 hiệp phụ trong một trận đấu?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào có biệt danh 'The King'?",
        options: ["Maradona", "Pele", "Messi", "Ronaldo"],
        answer: "Ronaldo",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 4 vị trí chính trong một đội?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng chuyền",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đội tuyển bóng đá nào vô địch World Cup 2014?",
        options: ["Brazil", "Argentina", "Đức", "Tây Ban Nha"],
        answer: "Đức",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 2 hiệp trong một trận đấu?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào có biệt danh 'The Magician'?",
        options: ["Maradona", "Pele", "Messi", "Ronaldinho"],
        answer: "Ronaldinho",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 6 vị trí chính trong một đội?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng chuyền",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Đội tuyển bóng đá nào vô địch World Cup 2010?",
        options: ["Brazil", "Argentina", "Đức", "Tây Ban Nha"],
        answer: "Tây Ban Nha",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có 4 hiệp trong một trận đấu?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng rổ",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào có biệt danh 'The Phenomenon'?",
        options: ["Maradona", "Pele", "Ronaldo", "Ronaldinho"],
        answer: "Ronaldo",
        category: "sports",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },

    // THỂ THAO - MEDIUM (20 câu)
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 2022?",
        options: ["Lionel Messi", "Kylian Mbappe", "Angel Di Maria", "Julian Alvarez"],
        answer: "Lionel Messi",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Golden Goal'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 2018?",
        options: ["Kylian Mbappe", "Antoine Griezmann", "Paul Pogba", "Olivier Giroud"],
        answer: "Kylian Mbappe",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Shot Clock'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng rổ",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 2014?",
        options: ["Mario Gotze", "Thomas Muller", "Mesut Ozil", "Toni Kroos"],
        answer: "Mario Gotze",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Tie Break'?",
        options: ["Bóng đá", "Bóng rổ", "Tennis", "Cầu lông"],
        answer: "Tennis",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 2010?",
        options: ["Andres Iniesta", "David Villa", "Xavi", "Fernando Torres"],
        answer: "Andres Iniesta",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Power Play'?",
        options: ["Bóng đá", "Bóng rổ", "Khúc côn cầu", "Bóng chuyền"],
        answer: "Khúc côn cầu",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 2006?",
        options: ["Fabio Grosso", "Marco Materazzi", "Andrea Pirlo", "Francesco Totti"],
        answer: "Fabio Grosso",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Sudden Death'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 2002?",
        options: ["Ronaldo", "Rivaldo", "Ronaldinho", "Cafu"],
        answer: "Ronaldo",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Challenge'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng chuyền",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1998?",
        options: ["Zinedine Zidane", "Emmanuel Petit", "Lilian Thuram", "Youri Djorkaeff"],
        answer: "Zinedine Zidane",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Let'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Cầu lông",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1994?",
        options: ["Roberto Baggio", "Franco Baresi", "Paolo Maldini", "Alessandro Del Piero"],
        answer: "Roberto Baggio",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Deuce'?",
        options: ["Bóng đá", "Bóng rổ", "Tennis", "Cầu lông"],
        answer: "Tennis",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1990?",
        options: ["Andreas Brehme", "Jurgen Klinsmann", "Lothar Matthaus", "Rudi Voller"],
        answer: "Andreas Brehme",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Foul'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng rổ",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1986?",
        options: ["Jorge Burruchaga", "Diego Maradona", "Jorge Valdano", "Oscar Ruggeri"],
        answer: "Jorge Burruchaga",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Offside'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1982?",
        options: ["Paolo Rossi", "Marco Tardelli", "Alessandro Altobelli", "Antonio Cabrini"],
        answer: "Paolo Rossi",
        category: "sports",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },

    // THỂ THAO - HARD (20 câu)
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1978?",
        options: ["Mario Kempes", "Daniel Bertoni", "Leopoldo Luque", "Oscar Ortiz"],
        answer: "Mario Kempes",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Hawk-Eye'?",
        options: ["Bóng đá", "Bóng rổ", "Tennis", "Cầu lông"],
        answer: "Tennis",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1974?",
        options: ["Gerd Muller", "Paul Breitner", "Franz Beckenbauer", "Uli Hoeness"],
        answer: "Gerd Muller",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'VAR'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1970?",
        options: ["Carlos Alberto", "Pele", "Jairzinho", "Rivelino"],
        answer: "Carlos Alberto",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Goal Line Technology'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1966?",
        options: ["Geoff Hurst", "Bobby Charlton", "Martin Peters", "Roger Hunt"],
        answer: "Geoff Hurst",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Instant Replay'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng rổ",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1962?",
        options: ["Vava", "Garrincha", "Pele", "Zito"],
        answer: "Vava",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Challenge System'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng chuyền",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1958?",
        options: ["Vava", "Pele", "Garrincha", "Zito"],
        answer: "Vava",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Review System'?",
        options: ["Bóng đá", "Bóng rổ", "Cricket", "Cầu lông"],
        answer: "Cricket",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1954?",
        options: ["Helmut Rahn", "Fritz Walter", "Max Morlock", "Ottmar Walter"],
        answer: "Helmut Rahn",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Video Review'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng rổ",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1950?",
        options: ["Alcides Ghiggia", "Juan Schiaffino", "Obdulio Varela", "Jose Leandro Andrade"],
        answer: "Alcides Ghiggia",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Electronic Line Calling'?",
        options: ["Bóng đá", "Bóng rổ", "Tennis", "Cầu lông"],
        answer: "Tennis",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1938?",
        options: ["Silvio Piola", "Giuseppe Meazza", "Gino Colaussi", "Giovanni Ferrari"],
        answer: "Silvio Piola",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Smart Ball'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng đá",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1934?",
        options: ["Angelo Schiavio", "Giuseppe Meazza", "Raimundo Orsi", "Enrique Guaita"],
        answer: "Angelo Schiavio",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Môn thể thao nào có luật 'Smart Replay'?",
        options: ["Bóng đá", "Bóng rổ", "Bóng chuyền", "Cầu lông"],
        answer: "Bóng rổ",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Cầu thủ bóng đá nào đã ghi bàn thắng quyết định trong trận chung kết World Cup 1930?",
        options: ["Hector Castro", "Pedro Cea", "Santos Iriarte", "Pablo Dorado"],
        answer: "Hector Castro",
        category: "sports",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },

    // GIẢI TRÍ - EASY (20 câu)
    {
        question: "Ai là người sáng lập ra Disney?",
        options: ["Walt Disney", "Roy Disney", "Michael Eisner", "Bob Iger"],
        answer: "Walt Disney",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim hoạt hình nào là phim đầu tiên của Disney?",
        options: ["Bạch Tuyết và 7 chú lùn", "Pinocchio", "Dumbo", "Bambi"],
        answer: "Bạch Tuyết và 7 chú lùn",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra Marvel Comics?",
        options: ["Stan Lee", "Jack Kirby", "Steve Ditko", "Martin Goodman"],
        answer: "Martin Goodman",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên của Marvel Cinematic Universe?",
        options: ["Iron Man", "The Incredible Hulk", "Thor", "Captain America"],
        answer: "Iron Man",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra Warner Bros?",
        options: ["Harry Warner", "Albert Warner", "Sam Warner", "Jack Warner"],
        answer: "Harry Warner",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có âm thanh?",
        options: ["The Jazz Singer", "The Kid", "City Lights", "Modern Times"],
        answer: "The Jazz Singer",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra Universal Pictures?",
        options: ["Carl Laemmle", "Jules Brulatour", "William Fox", "Adolph Zukor"],
        answer: "Carl Laemmle",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có màu?",
        options: ["The Wizard of Oz", "Gone with the Wind", "Snow White", "Becky Sharp"],
        answer: "Becky Sharp",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra Paramount Pictures?",
        options: ["Adolph Zukor", "Jesse Lasky", "Cecil B. DeMille", "Samuel Goldwyn"],
        answer: "Adolph Zukor",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng 3D?",
        options: ["Avatar", "The Polar Express", "Beowulf", "Chicken Little"],
        answer: "The Polar Express",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra 20th Century Fox?",
        options: ["William Fox", "Darryl F. Zanuck", "Joseph Schenck", "Spyros Skouras"],
        answer: "William Fox",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có CGI?",
        options: ["Tron", "Star Wars", "Jurassic Park", "Toy Story"],
        answer: "Tron",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra Columbia Pictures?",
        options: ["Harry Cohn", "Jack Cohn", "Joe Brandt", "Harry Warner"],
        answer: "Harry Cohn",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng motion capture?",
        options: ["The Polar Express", "Avatar", "Beowulf", "King Kong"],
        answer: "The Polar Express",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra MGM?",
        options: ["Louis B. Mayer", "Marcus Loew", "Samuel Goldwyn", "Irving Thalberg"],
        answer: "Marcus Loew",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng stop motion?",
        options: ["The Lost World", "King Kong", "The Nightmare Before Christmas", "Wallace & Gromit"],
        answer: "The Lost World",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra Pixar?",
        options: ["Ed Catmull", "Steve Jobs", "John Lasseter", "George Lucas"],
        answer: "Ed Catmull",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên của Pixar?",
        options: ["Toy Story", "A Bug's Life", "Monsters, Inc.", "Finding Nemo"],
        answer: "Toy Story",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Ai là người sáng lập ra DreamWorks Animation?",
        options: ["Steven Spielberg", "Jeffrey Katzenberg", "David Geffen", "Bill Gates"],
        answer: "Jeffrey Katzenberg",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên của DreamWorks Animation?",
        options: ["Antz", "Shrek", "Madagascar", "Kung Fu Panda"],
        answer: "Antz",
        category: "entertainment",
        difficulty: "easy",
        points: 10,
        timeLimit: 30
    },

    // GIẢI TRÍ - MEDIUM (20 câu)
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng morphing?",
        options: ["Willow", "Terminator 2", "The Abyss", "Total Recall"],
        answer: "Willow",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát minh ra kỹ thuật morphing trong phim?",
        options: ["Dennis Muren", "John Knoll", "Doug Smythe", "George Lucas"],
        answer: "Doug Smythe",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng bullet time?",
        options: ["The Matrix", "Blade", "Equilibrium", "Wanted"],
        answer: "The Matrix",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát minh ra kỹ thuật bullet time?",
        options: ["John Gaeta", "Zach Staenberg", "Bill Pope", "Lana Wachowski"],
        answer: "John Gaeta",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng motion capture hoàn chỉnh?",
        options: ["The Polar Express", "Avatar", "Beowulf", "King Kong"],
        answer: "Beowulf",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật motion capture hiện đại?",
        options: ["Andy Serkis", "James Cameron", "Robert Zemeckis", "Peter Jackson"],
        answer: "Andy Serkis",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng deepfake?",
        options: ["Rogue One", "The Irishman", "Gemini Man", "Terminator: Dark Fate"],
        answer: "Rogue One",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật deepfake trong phim?",
        options: ["Industrial Light & Magic", "Weta Digital", "Digital Domain", "MPC"],
        answer: "Industrial Light & Magic",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng virtual production?",
        options: ["The Mandalorian", "Avatar", "The Lion King", "Jungle Cruise"],
        answer: "The Mandalorian",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật virtual production?",
        options: ["Jon Favreau", "James Cameron", "Robert Zemeckis", "Peter Jackson"],
        answer: "Jon Favreau",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng de-aging?",
        options: ["The Curious Case of Benjamin Button", "The Irishman", "Gemini Man", "Terminator: Dark Fate"],
        answer: "The Curious Case of Benjamin Button",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật de-aging trong phim?",
        options: ["Digital Domain", "Industrial Light & Magic", "Weta Digital", "MPC"],
        answer: "Digital Domain",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng virtual camera?",
        options: ["Avatar", "The Lion King", "The Jungle Book", "Alita: Battle Angel"],
        answer: "Avatar",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật virtual camera?",
        options: ["James Cameron", "Robert Zemeckis", "Jon Favreau", "Peter Jackson"],
        answer: "James Cameron",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng performance capture?",
        options: ["Avatar", "The Polar Express", "Beowulf", "King Kong"],
        answer: "Avatar",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật performance capture?",
        options: ["James Cameron", "Robert Zemeckis", "Andy Serkis", "Peter Jackson"],
        answer: "James Cameron",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital makeup?",
        options: ["The Curious Case of Benjamin Button", "The Irishman", "Gemini Man", "Terminator: Dark Fate"],
        answer: "The Curious Case of Benjamin Button",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital makeup?",
        options: ["Digital Domain", "Industrial Light & Magic", "Weta Digital", "MPC"],
        answer: "Digital Domain",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital stunt double?",
        options: ["The Matrix", "Terminator 2", "The Abyss", "Total Recall"],
        answer: "The Matrix",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital stunt double?",
        options: ["John Gaeta", "Zach Staenberg", "Bill Pope", "Lana Wachowski"],
        answer: "John Gaeta",
        category: "entertainment",
        difficulty: "medium",
        points: 15,
        timeLimit: 30
    },

    // GIẢI TRÍ - HARD (20 câu)
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital fur simulation?",
        options: ["Monsters, Inc.", "The Lion King", "The Jungle Book", "Alita: Battle Angel"],
        answer: "Monsters, Inc.",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital fur simulation?",
        options: ["Pixar", "Industrial Light & Magic", "Weta Digital", "MPC"],
        answer: "Pixar",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital water simulation?",
        options: ["The Abyss", "Titanic", "Finding Nemo", "Pirates of the Caribbean"],
        answer: "The Abyss",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital water simulation?",
        options: ["Industrial Light & Magic", "Digital Domain", "Weta Digital", "MPC"],
        answer: "Industrial Light & Magic",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital cloth simulation?",
        options: ["The Matrix", "Titanic", "The Lord of the Rings", "Pirates of the Caribbean"],
        answer: "The Matrix",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital cloth simulation?",
        options: ["Mass Illusion", "Industrial Light & Magic", "Weta Digital", "MPC"],
        answer: "Mass Illusion",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital crowd simulation?",
        options: ["The Lord of the Rings", "Gladiator", "Troy", "300"],
        answer: "The Lord of the Rings",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital crowd simulation?",
        options: ["Weta Digital", "Industrial Light & Magic", "Digital Domain", "MPC"],
        answer: "Weta Digital",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital fire simulation?",
        options: ["Backdraft", "The Perfect Storm", "The Lord of the Rings", "Pirates of the Caribbean"],
        answer: "Backdraft",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital fire simulation?",
        options: ["Industrial Light & Magic", "Digital Domain", "Weta Digital", "MPC"],
        answer: "Industrial Light & Magic",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital smoke simulation?",
        options: ["The Perfect Storm", "The Lord of the Rings", "Pirates of the Caribbean", "Avatar"],
        answer: "The Perfect Storm",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital smoke simulation?",
        options: ["Industrial Light & Magic", "Digital Domain", "Weta Digital", "MPC"],
        answer: "Industrial Light & Magic",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital destruction simulation?",
        options: ["Independence Day", "The Matrix", "The Lord of the Rings", "2012"],
        answer: "Independence Day",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital destruction simulation?",
        options: ["Volker Engel", "Industrial Light & Magic", "Digital Domain", "MPC"],
        answer: "Volker Engel",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital hair simulation?",
        options: ["Monsters, Inc.", "The Lord of the Rings", "King Kong", "Avatar"],
        answer: "Monsters, Inc.",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital hair simulation?",
        options: ["Pixar", "Industrial Light & Magic", "Weta Digital", "MPC"],
        answer: "Pixar",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital muscle simulation?",
        options: ["The Hulk", "King Kong", "Avatar", "Planet of the Apes"],
        answer: "The Hulk",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital muscle simulation?",
        options: ["Industrial Light & Magic", "Digital Domain", "Weta Digital", "MPC"],
        answer: "Industrial Light & Magic",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital skin simulation?",
        options: ["The Curious Case of Benjamin Button", "Avatar", "The Irishman", "Gemini Man"],
        answer: "The Curious Case of Benjamin Button",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital skin simulation?",
        options: ["Digital Domain", "Industrial Light & Magic", "Weta Digital", "MPC"],
        answer: "Digital Domain",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Phim nào là phim đầu tiên có hiệu ứng digital eye simulation?",
        options: ["The Curious Case of Benjamin Button", "Avatar", "The Irishman", "Gemini Man"],
        answer: "The Curious Case of Benjamin Button",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    },
    {
        question: "Ai là người phát triển kỹ thuật digital eye simulation?",
        options: ["Digital Domain", "Industrial Light & Magic", "Weta Digital", "MPC"],
        answer: "Digital Domain",
        category: "entertainment",
        difficulty: "hard",
        points: 20,
        timeLimit: 30
    }
];

// Hàm để random câu hỏi
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const seedDatabase = async () => {
    try {
        // Clear existing questions
        await Question.deleteMany({});
        
        // Random câu hỏi trước khi thêm vào database
        const shuffledQuestions = shuffleArray([...sampleQuestions]);
        
        // Insert new questions
        await Question.insertMany(shuffledQuestions);
        
        console.log('Database seeded successfully with', shuffledQuestions.length, 'questions!');
        console.log('Phân bố câu hỏi theo danh mục và độ khó:');
        
        // Thống kê số lượng câu hỏi theo danh mục và độ khó
        const stats = {};
        shuffledQuestions.forEach(q => {
            if (!stats[q.category]) {
                stats[q.category] = { easy: 0, medium: 0, hard: 0 };
            }
            stats[q.category][q.difficulty]++;
        });
        
        Object.entries(stats).forEach(([category, difficulties]) => {
            console.log(`${category}: Easy: ${difficulties.easy}, Medium: ${difficulties.medium}, Hard: ${difficulties.hard}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 