import { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { closeModal } from 'soapbox/actions/modals.ts';
import { HTTPError } from 'soapbox/api/HTTPError.ts';
import { useApi } from 'soapbox/hooks/useApi.ts';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useInstance } from 'soapbox/hooks/useInstance.ts';
import { captchaSchema, type CaptchaData } from 'soapbox/schemas/captcha.ts';
import toast from 'soapbox/toast.tsx';



const messages = defineMessages({
  sucessMessage: { id: 'nostr_signup.captcha_message.sucess', defaultMessage: 'Incredible! You\'ve successfully completed the captcha.' },
  wrongMessage: { id: 'nostr_signup.captcha_message.wrong', defaultMessage: 'Oops! It looks like your captcha response was incorrect. Please try again.' },
  errorMessage: { id: 'nostr_signup.captcha_message.error', defaultMessage: 'It seems an error has occurred. Please try again. If the problem persists, please contact us.' },
  misbehavingMessage: { id: 'nostr_signup.captcha_message.misbehaving', defaultMessage: 'It looks like we\'re experiencing issues with the {instance}. Please try again. If the error persists, try again later.' },
});

function getRandomNumber(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed());
}

const useCaptcha = () => {
  const api = useApi();
  const { instance } = useInstance();
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const [captcha, setCaptcha] = useState<CaptchaData>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tryAgain, setTryAgain] = useState<boolean>(false);
  const [yPosition, setYPosition] = useState<number>();
  const [xPosition, setXPosition] = useState<number>();

  const loadCaptcha = async () => {
    try {
      const topI = getRandomNumber(0, (356 - 61));
      const leftI = getRandomNumber(0, (330 - 61));
      const response = await api.get('/api/v1/ditto/captcha');
      const data = captchaSchema.parse(await response.json());
      setCaptcha(data);
      setYPosition(topI);
      setXPosition(leftI);
    } catch (error) {
      toast.error('Error loading captcha');
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleChangePosition = (point: { x: number; y: number }) => {
    setXPosition(point.x);
    setYPosition(point.y);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (captcha) {
      const result = {
        x: xPosition,
        y: yPosition,
      };

      try {
        await api.post(`/api/v1/ditto/captcha/${captcha.id}/verify`, result).then(() => {
          setTryAgain(true);

          dispatch(closeModal('CAPTCHA'));
          toast.success(messages.sucessMessage);
        });
      } catch (error) {
        setTryAgain(true);

        const status = error instanceof HTTPError ? error.response.status : undefined;
        let message;

        switch (status) {
          case 400:
            message = intl.formatMessage(messages.wrongMessage);
            break;
          case 422:
            message = intl.formatMessage(messages.misbehavingMessage, { instance: instance.title });
            break;
          default:
            message = intl.formatMessage(messages.errorMessage);
            console.error(error);
            break;
        }

        toast.error(message);
      }
      setIsSubmitting(false);
    }
  };

  return {
    captcha,
    loadCaptcha,
    handleChangePosition,
    handleSubmit,
    isSubmitting,
    tryAgain,
    yPosition,
    xPosition,
  };
};

export default useCaptcha;