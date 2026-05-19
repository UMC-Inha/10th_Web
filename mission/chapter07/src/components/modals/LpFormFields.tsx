import { useLpFormContext } from './LpFormContext';
import { ContentField } from './fields/ContentField';
import { TagField } from './fields/TagField';
import { ThumbnailField } from './fields/ThumbnailField';
import { TitleField } from './fields/TitleField';

type LpFormFieldsProps = {
  titleId?: string;
  contentId?: string;
};

export default function LpFormFields({
  titleId = 'lp-title',
  contentId = 'lp-content',
}: LpFormFieldsProps) {
  const { errors } = useLpFormContext();

  return (
    <>
      <ThumbnailField />
      <TitleField id={titleId} />
      <ContentField id={contentId} />
      <TagField />
      {errors.form && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{errors.form}</p>
      )}
    </>
  );
}
