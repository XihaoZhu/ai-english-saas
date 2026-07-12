"use server";

export async function verifyInviteCode(code: string) {
    return code === process.env.REGISTER_INVITE_CODE;
}