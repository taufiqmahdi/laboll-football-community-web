import type { Community } from "@/app/data/schedules";

const sizes = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
  lg: "size-16 text-lg",
};

// Shows the community logo when there is one, otherwise its initials.
export default function CommunityAvatar({
  community,
  size = "sm",
}: {
  community: Community;
  size?: keyof typeof sizes;
}) {
  if (community.logo) {
    return (
      <img
        src={community.logo}
        alt={`Logo ${community.name}`}
        className={`shrink-0 rounded-full object-cover ${sizes[size]}`}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${community.color} ${sizes[size]}`}
    >
      {community.initials}
    </span>
  );
}
