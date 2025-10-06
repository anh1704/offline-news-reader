import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  author: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  categories: string[];
}

class NewsService {
  private readonly CACHE_KEY = 'cached_news';
  private readonly CATEGORIES_KEY = 'cached_categories';
  private readonly CACHE_TIMESTAMP_KEY = 'cache_timestamp';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Real news sources - RSS feeds from Vietnamese newspapers
  private readonly NEWS_SOURCES = {
    vnexpress: {
      url: 'https://vnexpress.net/rss',
      categories: {
        'Thời sự': 'https://vnexpress.net/rss/thoi-su.rss',
        'Góc nhìn': 'https://vnexpress.net/rss/goc-nhin.rss',
        'Thế giới': 'https://vnexpress.net/rss/the-gioi.rss',
        'Kinh doanh': 'https://vnexpress.net/rss/kinh-doanh.rss',
        'Khoa học': 'https://vnexpress.net/rss/khoa-hoc.rss',
        'Giải trí': 'https://vnexpress.net/rss/giai-tri.rss',
        'Thể thao': 'https://vnexpress.net/rss/the-thao.rss',
        'Sức khỏe': 'https://vnexpress.net/rss/suc-khoe.rss',
      }
    },
    tuoitre: {
      url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss',
      categories: {
        'Thời sự': 'https://tuoitre.vn/rss/thoi-su.rss',
        'Thế giới': 'https://tuoitre.vn/rss/the-gioi.rss',
        'Kinh tế': 'https://tuoitre.vn/rss/kinh-te.rss',
        'Giáo dục': 'https://tuoitre.vn/rss/giao-duc.rss',
        'Thể thao': 'https://tuoitre.vn/rss/the-thao.rss',
        'Giải trí': 'https://tuoitre.vn/rss/giai-tri.rss',
      }
    },
    thanhnien: {
      url: 'https://thanhnien.vn/rss/home.rss',
      categories: {
        'Chính trị': 'https://thanhnien.vn/rss/chinh-tri.rss',
        'Thế giới': 'https://thanhnien.vn/rss/the-gioi.rss',
        'Kinh tế': 'https://thanhnien.vn/rss/kinh-te.rss',
        'Thể thao': 'https://thanhnien.vn/rss/the-thao.rss',
        'Công nghệ': 'https://thanhnien.vn/rss/cong-nghe.rss',
      }
    }
  };

  // Updated Vietnamese news data as fallback
  private mockNewsData: NewsResponse = {
    articles: [
      {
        id: '1',
        title: 'Việt Nam đạt tăng trưởng GDP 6.2% trong quý III/2025',
        summary: 'Kinh tế Việt Nam tiếp tục phục hồi mạnh mẽ với nhiều ngành công nghiệp và dịch vụ tăng trưởng tích cực.',
        content: 'Theo báo cáo mới nhất từ Tổng cục Thống kê, GDP của Việt Nam trong quý III/2025 đạt mức tăng trưởng 6.2% so với cùng kỳ năm trước, cao hơn dự báo ban đầu là 5.8%.\n\nCác ngành công nghiệp chế biến, chế tạo tiếp tục là động lực chính với mức tăng 8.1%. Ngành công nghệ thông tin và dịch vụ tài chính cũng có những bước tiến đáng kể.\n\n"Đây là kết quả của những chính sách kinh tế linh hoạt và sự phục hồi của thương mại quốc tế," ông Nguyễn Văn A, Phó Tổng cục trưởng Tổng cục Thống kê cho biết.\n\nDự kiến cả năm 2025, Việt Nam có thể đạt mức tăng trưởng 6.5-7%, vượt mục tiêu đề ra.',
        category: 'Kinh tế',
        publishedAt: '2025-10-06T08:30:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=1',
        author: 'VnExpress'
      },
      {
        id: '2',
        title: 'TP.HCM triển khai tuyến metro số 2 vào tháng 12/2025',
        summary: 'Dự án đường sắt đô thị quan trọng kết nối Bến Thành - Tham Lương sắp được đưa vào vận hành thử nghiệm.',
        content: 'In an unprecedented display of global cooperation, leaders from 195 countries have reached a historic agreement at the Global Climate Summit. The comprehensive plan outlines ambitious targets for reducing greenhouse gas emissions by 50% before 2030.\n\nThe agreement includes substantial commitments from major industrial nations to transition to renewable energy sources and invest in green technology development. Developing nations will receive significant financial support to implement sustainable development practices.\n\nKey provisions of the agreement include:\n• Mandatory carbon neutrality goals for all signatory nations\n• $500 billion global fund for renewable energy infrastructure\n• Protection of 30% of world\'s oceans and land by 2030\n• Transition away from fossil fuels in public transportation\n\n"This is the moment when humanity chose hope over fear," declared UN Secretary-General Maria Rodriguez. "The agreement represents our collective commitment to leaving a livable planet for future generations."\n\nImplementation will begin immediately, with quarterly progress reviews scheduled throughout the next decade.',
        category: 'Environment',
        publishedAt: '2024-03-14T14:20:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=2',
        author: 'Environmental Correspondent'
      },
      {
        id: '3',
        title: 'Medical Breakthrough: New Treatment Shows Promise',
        summary: 'Clinical trials reveal 90% success rate for innovative cancer therapy.',
        content: 'Medical researchers have announced remarkable results from Phase III clinical trials of a revolutionary cancer treatment that combines immunotherapy with precision medicine. The treatment showed a 90% success rate in eliminating tumors across multiple cancer types.\n\nThe innovative approach uses the patient\'s own immune system, enhanced with engineered cells that specifically target cancer markers. Unlike traditional chemotherapy, this treatment has shown minimal side effects while maintaining high efficacy rates.\n\nDr. Michael Thompson, principal investigator of the study, explained: "What makes this treatment extraordinary is its precision. We\'re essentially training the patient\'s immune system to recognize and eliminate cancer cells while leaving healthy tissue untouched."\n\nThe study involved 2,000 patients across 15 countries over a period of four years. Results showed significant improvement in survival rates and quality of life compared to conventional treatments.\n\nRegulatory approval is expected within the next 18 months, with the treatment potentially becoming available to patients by 2025. The pharmaceutical company has committed to making the treatment accessible through partnership programs with healthcare systems worldwide.',
        category: 'Health',
        publishedAt: '2024-03-13T09:15:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=3',
        author: 'Medical Affairs Reporter'
      },
      {
        id: '4',
        title: 'Economic Markets Show Strong Recovery Signs',
        summary: 'Global indices reach new highs amid optimistic economic indicators.',
        content: 'Financial markets worldwide are experiencing a significant rally as key economic indicators point to sustained recovery and growth. Major stock indices have reached record highs, with technology and renewable energy sectors leading the surge.\n\nThe positive momentum is driven by several factors including lower inflation rates, strong employment figures, and increased consumer confidence. Central banks have maintained supportive monetary policies while signaling a cautious approach to future adjustments.\n\nKey market highlights include:\n• S&P 500 up 15% year-to-date\n• Technology sector gains of 22%\n• Unemployment rates at historic lows\n• Consumer spending increased by 8%\n\nEconomic analysts are cautiously optimistic about the sustainability of this growth. "We\'re seeing genuine economic expansion backed by solid fundamentals," noted chief economist Dr. Jennifer Walsh. "However, geopolitical factors and supply chain considerations remain important variables to monitor."\n\nCorporate earnings reports have exceeded expectations across most sectors, with companies reporting strong revenue growth and improved profit margins. Investment in research and development has reached new levels, indicating confidence in long-term growth prospects.',
        category: 'Business',
        publishedAt: '2024-03-12T16:45:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=4',
        author: 'Business News Desk'
      },
      {
        id: '5',
        title: 'Sports Championship Delivers Thrilling Finale',
        summary: 'Underdog team claims victory in stunning upset that captivated millions.',
        content: 'In one of the most dramatic championship finales in recent memory, the underdog Phoenix Ravens defeated the heavily favored Metropolitan Lions 28-24 in a game that will be remembered for generations. The victory completed an incredible journey from last place to championship glory.\n\nThe game featured multiple lead changes, spectacular plays, and a final-minute touchdown that sent Ravens fans into euphoria. Quarterback Jake Morrison, who was benched earlier in the season, threw for 342 yards and three touchdowns in a performance that will define his career.\n\n"This team never gave up," said head coach Maria Santos. "When everyone counted us out, we used that as motivation to prove we belonged here. This championship is for every player who believed in our vision."\n\nThe Ravens\' journey to the championship was marked by adversity and resilience. After starting the season with six consecutive losses, the team rallied behind new leadership and a commitment to fundamental excellence.\n\nKey moments from the championship game:\n• Morrison\'s 45-yard touchdown pass with 2:14 remaining\n• Defense forced three turnovers in the second half\n• Ravens converted 8 of 12 third-down attempts\n• Record-breaking 87,000 fans in attendance\n\nThe celebration continued into the early morning hours as the city embraced its first championship in over three decades.',
        category: 'Sports',
        publishedAt: '2024-03-11T21:30:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=5',
        author: 'Sports Reporter'
      },
      {
        id: '6',
        title: 'Space Exploration Reaches New Milestone',
        summary: 'Mars mission successfully establishes permanent research base.',
        content: 'The international Mars colonization project has achieved a historic milestone with the successful establishment of a permanent research base on the Red Planet. The facility, named "New Horizon Station," will house 12 researchers and serve as humanity\'s first step toward becoming a multi-planetary species.\n\nThe base features state-of-the-art life support systems, advanced laboratories, and sustainable resource extraction capabilities. Solar panels and nuclear power systems provide reliable energy, while atmospheric processors begin the long-term terraforming process.\n\nMission Commander Dr. Elena Petrov reported: "Everything is functioning perfectly. We\'ve successfully grown our first crops in Martian soil, and our water reclamation systems are exceeding expectations. This is truly a new chapter in human exploration."\n\nThe achievement represents the culmination of a 15-year international effort involving space agencies from six countries. Advanced robotics and artificial intelligence systems support daily operations, while regular communication with Earth maintains scientific collaboration.\n\nResearch priorities include:\n• Geological surveys for mineral resources\n• Atmospheric composition studies\n• Biological experiments in low gravity\n• Development of sustainable agriculture\n\nPlans are already underway for expansion of the base, with additional modules scheduled for delivery over the next two years. The ultimate goal is to establish a self-sustaining colony capable of supporting hundreds of residents.',
        category: 'Science',
        publishedAt: '2024-03-10T12:00:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=6',
        author: 'Space Correspondent'
      }
    ],
    categories: ['Technology', 'Environment', 'Health', 'Business', 'Sports', 'Science', 'World', 'Politics']
  };

  async isOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  }

  async fetchNews(category?: string, source: 'vnexpress' | 'tuoitre' | 'thanhnien' = 'vnexpress'): Promise<NewsArticle[]> {
    const online = await this.isOnline();
    
    if (online) {
      try {
        // Try to fetch real RSS data first
        console.log('Attempting to fetch RSS news...');
        const articles = await this.fetchRSSNews(source, category);
        
        if (articles.length > 0) {
          console.log('Successfully fetched RSS data:', articles.length, 'articles');
          // Cache the fresh data
          await this.cacheNews(articles);
          await AsyncStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
          return articles;
        } else {
          console.log('RSS failed, using Vietnamese mock data');
          // Use high-quality Vietnamese mock data as fallback
          return await this.getVietnameseMockData(source, category);
        }
      } catch (error) {
        console.error('Error fetching RSS news:', error);
        // Fallback to cache or mock data if RSS fails
        const cached = await this.getCachedNews(category);
        if (cached.length > 0) {
          return cached;
        }
        return await this.getMockNewsData(category);
      }
    } else {
      // Return cached data when offline
      return await this.getCachedNews(category);
    }
  }

  private async fetchRSSNews(source: 'vnexpress' | 'tuoitre' | 'thanhnien', category?: string): Promise<NewsArticle[]> {
    try {
      // Try multiple RSS2JSON alternatives
      const rssServices = [
        'https://api.rss2json.com/v1/api.json',
        'https://rss2json.com/api.json',
        'https://cors-anywhere.herokuapp.com/https://api.rss2json.com/v1/api.json'
      ];

      // Determine RSS URL based on source and category
      const sourceConfig = this.NEWS_SOURCES[source];
      let rssUrl = sourceConfig.url;
      
      if (category && category !== 'Tất cả') {
        const categoryUrl = (sourceConfig.categories as any)[category];
        if (categoryUrl) {
          rssUrl = categoryUrl;
        }
      }

      console.log('Fetching from RSS:', rssUrl);

      // Try different RSS services
      for (const serviceUrl of rssServices) {
        try {
          const apiUrl = `${serviceUrl}?rss_url=${encodeURIComponent(rssUrl)}&count=15`;
          console.log('Trying service:', serviceUrl);
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            console.log(`Service failed with status: ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          console.log('RSS Response:', data);
          
          if (data.status === 'ok' && data.items && data.items.length > 0) {
            console.log('Successfully got RSS data from', serviceUrl);
            return data.items.map((item: any, index: number) => ({
              id: `${source}_${index}_${Date.now()}`,
              title: this.cleanHtmlTags(item.title || 'Không có tiêu đề'),
              summary: this.cleanHtmlTags(item.description || 'Không có tóm tắt').substring(0, 200) + '...',
              content: this.cleanHtmlTags(item.content || item.description || 'Nội dung đang được cập nhật...'),
              category: category || this.extractCategory(item.categories),
              publishedAt: item.pubDate || new Date().toISOString(),
              imageUrl: this.extractImageUrl(item.content || item.description) || item.enclosure?.link || `https://picsum.photos/400/200?random=${index}`,
              author: item.author || this.getSourceName(source)
            }));
          }
        } catch (serviceError) {
          console.log('Service error:', serviceError);
          continue;
        }
      }

      // If all RSS services fail, try direct NewsAPI
      console.log('RSS services failed, trying NewsAPI fallback');
      return await this.fetchNewsAPI(source, category);
      
    } catch (error) {
      console.error('All RSS fetch methods failed:', error);
      return [];
    }
  }

  private async fetchNewsAPI(source: 'vnexpress' | 'tuoitre' | 'thanhnien', category?: string): Promise<NewsArticle[]> {
    try {
      // Use free NewsAPI (no key required for some endpoints)
      const domains = {
        'vnexpress': 'vnexpress.net',
        'tuoitre': 'tuoitre.vn',
        'thanhnien': 'thanhnien.vn'
      };

      const apiUrl = `https://newsapi.org/v2/everything?domains=${domains[source]}&pageSize=15&language=vi&sortBy=publishedAt`;
      
      console.log('Trying NewsAPI:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          console.log('NewsAPI success');
          return data.articles.map((article: any, index: number) => ({
            id: `newsapi_${source}_${index}_${Date.now()}`,
            title: article.title || 'Không có tiêu đề',
            summary: article.description || 'Không có tóm tắt',
            content: article.content || article.description || 'Nội dung đang được cập nhật...',
            category: category || 'Tổng hợp',
            publishedAt: article.publishedAt || new Date().toISOString(),
            imageUrl: article.urlToImage || `https://picsum.photos/400/200?random=${index}`,
            author: article.author || this.getSourceName(source)
          }));
        }
      }
      
      return [];
    } catch (error) {
      console.error('NewsAPI error:', error);
      return [];
    }
  }

  private cleanHtmlTags(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  private extractImageUrl(content: string): string | null {
    const imgRegex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/i;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  }

  private extractCategory(categories: any[]): string {
    if (categories && categories.length > 0) {
      return categories[0];
    }
    return 'Tổng hợp';
  }

  private getSourceName(source: 'vnexpress' | 'tuoitre' | 'thanhnien'): string {
    const sourceNames = {
      'vnexpress': 'VnExpress',
      'tuoitre': 'Tuổi Trẻ',
      'thanhnien': 'Thanh Niên'
    };
    return sourceNames[source] || 'Báo chí';
  }

  private async getVietnameseMockData(source: 'vnexpress' | 'tuoitre' | 'thanhnien', category?: string): Promise<NewsArticle[]> {
    // High-quality Vietnamese news data categorized by source
    const vietnameseNews = this.getVietnameseNewsBySource(source);
    
    // Filter by category if specified
    let articles = vietnameseNews;
    if (category && category !== 'Tất cả') {
      articles = vietnameseNews.filter(article => article.category === category);
    }
    
    // Cache the mock data
    await this.cacheNews(articles);
    await AsyncStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
    
    return articles;
  }

  private getVietnameseNewsBySource(source: 'vnexpress' | 'tuoitre' | 'thanhnien'): NewsArticle[] {
    const baseNews = [
      {
        id: `${source}_1_${Date.now()}`,
        title: 'Việt Nam đạt tăng trưởng GDP 6.2% trong quý III/2025',
        summary: 'Kinh tế Việt Nam tiếp tục phục hồi mạnh mẽ với nhiều ngành công nghiệp và dịch vụ tăng trưởng tích cực.',
        content: 'Theo báo cáo mới nhất từ Tổng cục Thống kê, GDP của Việt Nam trong quý III/2025 đạt mức tăng trưởng 6.2% so với cùng kỳ năm trước, cao hơn dự báo ban đầu là 5.8%.\n\nCác ngành công nghiệp chế biến, chế tạo tiếp tục là động lực chính với mức tăng 8.1%. Ngành công nghệ thông tin và dịch vụ tài chính cũng có những bước tiến đáng kể.\n\n"Đây là kết quả của những chính sách kinh tế linh hoạt và sự phục hồi của thương mại quốc tế," ông Nguyễn Văn A, Phó Tổng cục trưởng Tổng cục Thống kê cho biết.\n\nDự kiến cả năm 2025, Việt Nam có thể đạt mức tăng trưởng 6.5-7%, vượt mục tiêu đề ra. Xuất khẩu tăng 12% so với năm trước, đặc biệt trong lĩnh vực điện tử và dệt may.\n\nNhà đầu tư nước ngoài cũng tăng cường rót vốn vào Việt Nam với tổng vốn FDI đạt 18.5 tỷ USD trong 9 tháng đầu năm.',
        category: 'Kinh tế',
        publishedAt: '2025-10-06T08:30:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=1',
        author: this.getSourceName(source)
      },
      {
        id: `${source}_2_${Date.now() + 1}`,
        title: 'TP.HCM triển khai tuyến metro số 2 Bến Thành - Tham Lương',
        summary: 'Dự án đường sắt đô thị quan trọng kết nối các quận trung tâm với ngoại thành sắp được đưa vào vận hành.',
        content: 'Ủy ban nhân dân TP.HCM vừa thông báo kế hoạch chính thức đưa tuyến metro số 2 (Bến Thành - Tham Lương) vào vận hành thử nghiệm từ tháng 12/2025.\n\nTuyến đường sắt dài 11.3 km với 11 ga sẽ kết nối trung tâm thành phố với các khu vực đông dân cư như quận 6, Tân Phú. Công suất vận chuyển ước tính 40,000 lượt khách mỗi ngày.\n\n"Đây là bước tiến quan trọng trong việc phát triển hệ thống giao thông công cộng hiện đại của TP.HCM," ông Trần Văn B, Phó Chủ tịch UBND thành phố cho biết.\n\nDự án có tổng mức đầu tư 47,000 tỷ đồng, được tài trợ bởi Ngân hàng Phát triển châu Á (ADB). Việc vận hành chính thức dự kiến vào quý II/2026.\n\nTrước đó, tuyến metro số 1 (Bến Thành - Suối Tiên) đã vận hành thành công từ cuối năm 2024, phục vụ hơn 100,000 lượt khách mỗi ngày.',
        category: 'Thời sự',
        publishedAt: '2025-10-06T07:15:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=2',
        author: this.getSourceName(source)
      },
      {
        id: `${source}_3_${Date.now() + 2}`,
        title: 'Việt Nam giành 3 huy chương vàng tại SEA Games 33',
        summary: 'Đoàn thể thao Việt Nam có ngày thi đấu thành công với các môn bơi lội, cầu lông và võ thuật.',
        content: 'Tại ngày thi đấu thứ 5 của SEA Games 33 diễn ra tại Bangkok, Thái Lan, đoàn thể thao Việt Nam đã giành được 3 huy chương vàng, nâng tổng số huy chương vàng lên 15 chiếc.\n\nNguyễn Thị C xuất sắc phá kỷ lục SEA Games ở nội dung bơi ngửa 100m nữ với thành tích 1 phút 02 giây 15. Đây là lần đầu tiên một VĐV bơi lội Việt Nam phá kỷ lục tại đấu trường này.\n\nỞ môn cầu lông, cặp đôi Trần Văn D - Lê Thị E đánh bại đối thủ mạnh từ Indonesia để giành HCV đôi nam nữ. Trong khi đó, võ sĩ Phạm Văn F tiếp tục truyền thống mạnh của vovinam Việt Nam bằng chiến thắng thuyết phục.\n\n"Các VĐV đã thi đấu với tinh thần quyết tâm cao và thể hiện được sức mạnh thể thao Việt Nam," ông Trưởng đoàn cho biết.\n\nViệt Nam hiện đang xếp thứ 4 trên bảng tổng sắp huy chương, chỉ sau Thái Lan, Singapore và Indonesia.',
        category: 'Thể thao',
        publishedAt: '2025-10-06T06:45:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=3',
        author: this.getSourceName(source)
      },
      {
        id: `${source}_4_${Date.now() + 3}`,
        title: 'Khởi động dự án thành phố thông minh tại Đà Nẵng',
        summary: 'Đà Nẵng chính thức triển khai các giải pháp IoT và AI để trở thành thành phố thông minh hàng đầu Việt Nam.',
        content: 'UBND thành phố Đà Nẵng vừa ký kết hợp đồng với tập đoàn công nghệ hàng đầu để triển khai dự án thành phố thông minh trị giá 2,500 tỷ đồng.\n\nDự án sẽ ứng dụng công nghệ IoT (Internet of Things), AI (trí tuệ nhân tạo) và big data để quản lý giao thông, môi trường, an ninh và các dịch vụ công cộng.\n\nGiai đoạn 1 (2025-2027) sẽ tập trung vào hệ thống giao thông thông minh với 500 camera AI và 200 cảm biến đo chất lượng không khí. Người dân có thể theo dõi tình hình giao thông thời gian thực qua ứng dụng di động.\n\n"Đà Nẵng sẽ trở thành điểm sáng về thành phố thông minh ở khu vực Đông Nam Á," ông Chủ tịch UBND thành phố nhấn mạnh.\n\nDự án cũng bao gồm hệ thống thanh toán không tiền mặt, quản lý rác thải thông minh và cảnh báo thiên tai tự động. Dự kiến hoàn thành toàn bộ vào năm 2030.',
        category: 'Công nghệ',
        publishedAt: '2025-10-06T05:20:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=4',
        author: this.getSourceName(source)
      },
      {
        id: `${source}_5_${Date.now() + 4}`,
        title: 'Phát hiện phương pháp điều trị ung thư mới tại BV Chợ Rẫy',
        summary: 'Đội ngũ bác sĩ Việt Nam thành công trong việc ứng dụng liệu pháp miễn dịch kết hợp tế bào gốc.',
        content: 'Bệnh viện Chợ Rẫy (TP.HCM) vừa công bố thành công của ca điều trị ung thư phổi giai đoạn cuối bằng phương pháp kết hợp liệu pháp miễn dịch và tế bào gốc.\n\nBệnh nhân nam 62 tuổi được chẩn đoán ung thư phổi di căn từ tháng 3/2025. Sau 6 tháng điều trị bằng phương pháp mới, khối u đã co nhỏ 80% và không phát hiện tế bào ung thư trong máu.\n\nGS.TS Nguyễn Văn G, Trưởng khoa Ung bướu cho biết: "Đây là lần đầu tiên tại Việt Nam chúng tôi áp dụng thành công liệu pháp CAR-T kết hợp tế bào gốc tự thân."\n\nPhương pháp này đã được thử nghiệm thành công tại 15 bệnh nhân khác với tỷ lệ đáp ứng điều trị đạt 73%. Chi phí điều trị chỉ bằng 1/3 so với điều trị ở nước ngoài.\n\nBệnh viện Chợ Rẫy dự định mở rộng ứng dụng cho các loại ung thư khác như ung thư gan, dạ dày trong năm 2026.',
        category: 'Sức khỏe',
        publishedAt: '2025-10-06T04:30:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=5',
        author: this.getSourceName(source)
      },
      {
        id: `${source}_6_${Date.now() + 5}`,
        title: 'Lễ hội Áo dài Việt Nam thu hút 500,000 du khách quốc tế',
        summary: 'Sự kiện văn hóa lớn nhất năm tại Hội An giới thiệu vẻ đẹp truyền thống Việt Nam với thế giới.',
        content: 'Lễ hội Áo dài Việt Nam lần thứ 8 diễn ra tại phố cổ Hội An đã thu hút hơn 500,000 lượt khách tham quan, trong đó có 200,000 du khách quốc tế.\n\nSự kiện kéo dài 7 ngày với hơn 50 hoạt động đa dạng: trình diễn thời trang áo dài, workshop dạy may áo dài, triển lãm ảnh và các chương trình biểu diễn nghệ thuật.\n\nĐặc biệt, màn trình diễn "Áo dài qua các thời kỳ" với sự tham gia của 200 người mẫu đã để lại ấn tượng sâu sắc. Các thiết kế áo dài cách tân của NTK trẻ Việt Nam cũng nhận được sự quan tâm lớn.\n\n"Lễ hội không chỉ quảng bá văn hóa mà còn thúc đẩy du lịch và kinh tế địa phương," bà Chủ tịch UBND tỉnh Quảng Nam chia sẻ.\n\nDoanh thu từ lễ hội ước tính đạt 150 tỷ đồng, góp phần quan trọng vào phát triển du lịch văn hóa bền vững tại Việt Nam.',
        category: 'Giải trí',
        publishedAt: '2025-10-06T03:15:00Z',
        imageUrl: 'https://picsum.photos/400/200?random=6',
        author: this.getSourceName(source)
      }
    ];

    return baseNews.map(article => ({
      ...article,
      author: this.getSourceName(source)
    }));
  }

  private async getMockNewsData(category?: string): Promise<NewsArticle[]> {
    // Filter by category if specified  
    let articles = this.mockNewsData.articles;
    if (category && category !== 'All' && category !== 'Tất cả') {
      articles = articles.filter(article => article.category === category);
    }
    
    // Cache the mock data
    await this.cacheNews(articles);
    await AsyncStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
    
    return articles;
  }

  async getCategories(source: 'vnexpress' | 'tuoitre' | 'thanhnien' = 'vnexpress'): Promise<string[]> {
    const online = await this.isOnline();
    
    if (online) {
      // Get categories based on selected news source
      const sourceConfig = this.NEWS_SOURCES[source];
      const categories = Object.keys(sourceConfig.categories);
      
      // Cache categories
      await AsyncStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
      return ['Tất cả', ...categories];
    } else {
      // Return cached categories
      try {
        const cached = await AsyncStorage.getItem(this.CATEGORIES_KEY);
        if (cached) {
          const categories = JSON.parse(cached);
          return ['Tất cả', ...categories];
        }
      } catch (error) {
        console.error('Error reading cached categories:', error);
      }
      
      // Fallback to vnexpress categories
      const categories = Object.keys(this.NEWS_SOURCES.vnexpress.categories);
      return ['Tất cả', ...categories];
    }
  }

  private async cacheNews(articles: NewsArticle[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(articles));
    } catch (error) {
      console.error('Error caching news:', error);
    }
  }

  private async getCachedNews(category?: string): Promise<NewsArticle[]> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_KEY);
      if (cached) {
        let articles: NewsArticle[] = JSON.parse(cached);
        
        // Filter by category if specified
        if (category && category !== 'All') {
          articles = articles.filter(article => article.category === category);
        }
        
        return articles;
      }
    } catch (error) {
      console.error('Error reading cached news:', error);
    }
    
    // Return mock data as fallback
    let articles = this.mockNewsData.articles;
    if (category && category !== 'All') {
      articles = articles.filter(article => article.category === category);
    }
    return articles;
  }

  async isCacheStale(): Promise<boolean> {
    try {
      const timestamp = await AsyncStorage.getItem(this.CACHE_TIMESTAMP_KEY);
      if (!timestamp) return true;
      
      const cacheAge = Date.now() - parseInt(timestamp);
      return cacheAge > this.CACHE_DURATION;
    } catch (error) {
      return true;
    }
  }

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.CACHE_KEY, this.CATEGORIES_KEY, this.CACHE_TIMESTAMP_KEY]);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default new NewsService();