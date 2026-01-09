-- Update service images with proper URLs
update public.services
set image_url = '/images/cyber-security-service.jpg'
where title = 'Siber Güvenlik';

update public.services
set image_url = '/images/forensic-service.jpg'
where title = 'Adli Bilişim';

update public.services
set image_url = '/images/data-recovery-service.jpg'
where title = 'Veri Kurtarma';

update public.services
set image_url = '/images/access-control-service.jpg'
where title = 'Geçiş Kontrol ve Güvenlik Sistemleri';
