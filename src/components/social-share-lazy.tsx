'use client';

import React, { Suspense } from 'react';
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share';

interface SocialShareProps {
  url: string;
  title?: string;
  className?: string;
}

export const SocialShareButtons: React.FC<SocialShareProps> = ({ url, title, className }) => {
  return (
    <div className={className}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-wrap gap-3 justify-center">
          <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          <FacebookShareButton url={url} title={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>

          <TwitterShareButton url={url} title={title}>
            <XIcon size={40} round />
          </TwitterShareButton>

          <TelegramShareButton url={url} title={title}>
            <TelegramIcon size={40} round />
          </TelegramShareButton>

          <LinkedinShareButton url={url} title={title}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
        </div>
      </Suspense>
    </div>
  );
};