import useUserStore from "@/state/userStore";
import { Flex, Avatar, TextField, Label, Heading, Button } from "../shared";
import { ProfileAvatar } from "./ProfileAvatar";
import { useState } from "react";

export type UserInfoProps = {};

export function UserInfo({}: UserInfoProps) {
  const [editing, setEditing] = useState(false);
  const userInfo = useUserStore();
  const [editedFirstName, setEditedFirstName] = useState(userInfo.firstName);
  const [editedLastName, setEditedLastName] = useState(userInfo.lastName);
  const [editedEmail, setEditedEmail] = useState(userInfo.email);

  return (
    <Flex direction='row' align='center' justify='between' gap='6'>
      <ProfileAvatar />
      <Flex direction='column' gap='3'>
        <Flex direction='row' gap='4'>
          <Flex direction='column'>
            <Label htmlFor='first-name'>First Name</Label>
            {editing ? (
              <TextField
                type='text'
                size='2'
                id='first-name'
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
              />
            ) : (
              <Heading size='1'>{userInfo.firstName}</Heading>
            )}
          </Flex>
          <Flex direction='column'>
            <Label htmlFor='last-name'>Last Name</Label>
            {editing ? (
              <TextField
                type='text'
                size='2'
                id='last-name'
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
              />
            ) : (
              <Heading size='1'>{userInfo.lastName}</Heading>
            )}
          </Flex>
        </Flex>

        <Flex direction='column'>
          <Label htmlFor='email'>Email Address</Label>
          {editing ? (
            <TextField
              type='email'
              size='2'
              id='email'
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
          ) : (
            <Heading size='1'>{userInfo.email}</Heading>
          )}
        </Flex>

        <Flex direction='row' gap='2' justify='end'>
          {editing ? (
            <>
              <Button
                variant='gray'
                onClick={() => {
                  setEditing(false);
                  setEditedFirstName(userInfo.firstName);
                  setEditedLastName(userInfo.lastName);
                  setEditedEmail(userInfo.email);
                }}
              >
                Cancel
              </Button>
              <Button variant='green'>Save</Button>
            </>
          ) : (
            <Button variant='gray' onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
